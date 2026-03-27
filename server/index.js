/* eslint-env node */
/* global process */

import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import dotenv from "dotenv";

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));

let serviceAccount;
try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } else {
    serviceAccount = JSON.parse(
      readFileSync(join(__dirname, "serviceAccountKey.json"), "utf8")
    );
  }
} catch {
  console.error("❌  Could not load Firebase service account.");
  process.exit(1);
}

initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

const app = express();
const allowedOrigins = [
  "http://localhost:5173",
  "https://the-crunch-4735e.web.app",
  "https://the-crunch-4735e.firebaseapp.com"
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://the-crunch-4735e.web.app",
      "https://the-crunch-4735e.firebaseapp.com",
      "http://the-crunch.up.railway.app" 
    ],
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.use(express.json());
app.get("/health", (_req, res) => res.json({ status: "ok" }));

// Track connected sockets
io.on("connection", (socket) => {
  console.log(`🔌  Socket connected: ${socket.id}`);

  socket.on("join", ({ userId }) => {
    if (!userId) return;
    // Leave all previous rooms first
    socket.rooms.forEach((room) => {
      if (room !== socket.id) socket.leave(room);
    });
    socket.join(userId);
    console.log(`   → ${socket.id} joined room [${userId}]`);
  });

  socket.on("disconnect", (reason) => {
    console.log(`🔌  Socket disconnected: ${socket.id} — reason: ${reason}`);
  });
});

const STATUS_MESSAGES = {
  Pending:   "⏳ Your order has been received and is waiting to be confirmed.",
  Preparing: "👨‍🍳 Your order is being prepared! Hang tight.",
  Ready:     "✅ Your order is ready! Come pick it up or it's on its way.",
  Delivered: "📦 Your order has been delivered. Enjoy your meal!",
};

// Track order statuses to detect real changes
const orderStatusCache = new Map();
// Track server start time to ignore pre-existing orders
const serverStartTime = Date.now();

// Single Firestore listener for everything
db.collection("orders").onSnapshot(
  (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      const order = { id: change.doc.id, ...change.doc.data() };

      // ── New order added ──────────────────────────────────────────
      if (change.type === "added") {
        // Cache the status
        orderStatusCache.set(order.id, order.status);

        // Only notify for orders placed AFTER server started
        const createdMs = order.createdAt?._seconds
          ? order.createdAt._seconds * 1000
          : null;

        if (!createdMs || createdMs < serverStartTime - 5000) return;

        const itemCount = Array.isArray(order.items)
          ? order.items.reduce((s, i) => s + (i.qty || 1), 0)
          : 0;

        console.log(`🛎️  New order [${order.id}] → notifying admin room`);
        io.to("admin").emit("new_order", {
          orderId: order.id,
          customerName: order.customerName || "A customer",
          orderType: order.orderType || "Order",
          total: order.total || 0,
          itemCount,
          createdAt: createdMs,
        });
      }

      // ── Existing order modified ──────────────────────────────────
      if (change.type === "modified") {
  const prevStatus = orderStatusCache.get(order.id);
  const newStatus = order.status;

  console.log(`🔍  Modified order [${order.id}] — prevStatus: ${prevStatus}, newStatus: ${newStatus}, userId: ${order.userId}`);
  console.log(`🔍  Status cache had this order: ${orderStatusCache.has(order.id)}`);

  if (prevStatus === newStatus) {
    console.log(`⏭️  Skipping — status unchanged`);
    return;
  }
  orderStatusCache.set(order.id, newStatus);

  const userId = order.userId;
  if (!userId || !newStatus) {
    console.log(`⏭️  Skipping — missing userId or status`);
    return;
  }

  console.log(`📦  Emitting to room [${userId}]`);
  console.log(`📦  Rooms currently active:`, [...io.sockets.adapter.rooms.keys()]);
        io.to(userId).emit("order_status_updated", {
          orderId: order.id,
          status: newStatus,
          customerName: order.customerName || "",
          orderType: order.orderType || "Order",
          message: STATUS_MESSAGES[newStatus] || `Your order is now ${newStatus}.`,
        });
      }
    });
  },
  (err) => {
    console.error("❌  Firestore listener error:", err.message);
  }
);

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`\n🚀  Notification server running on port ${PORT}`);
  console.log(`   CORS: open to all origins (development mode)\n`);
});