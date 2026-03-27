import { useEffect } from "react";
import { io } from "socket.io-client";

const SERVER_URL = import.meta.env.VITE_NOTIFICATION_SERVER || "http://localhost:3001";

// Module-level singleton
let _socket = null;
let _joinedRooms = new Set();
let _handlers = new Map(); // track handlers to avoid duplicates

function getSocket() {
  if (!_socket || _socket.disconnected) {
    _socket = io(SERVER_URL, {
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
    });

    _socket.on("connect", () => {
      console.log("[Notifications] Socket connected:", _socket.id);

      // Rejoin all rooms
      _joinedRooms.forEach((room) => {
        _socket.emit("join", { userId: room });
        console.log("[Notifications] Rejoined room:", room);
      });

      // Re-register all handlers on the new/reconnected socket
      _handlers.forEach((handler, role) => {
        const eventName = role === "admin" ? "new_order" : "order_status_updated";
        _socket.off(eventName, handler); // prevent duplicate
        _socket.on(eventName, handler);
        console.log("[Notifications] Re-registered handler for role:", role);
      });
    });

    _socket.on("disconnect", (reason) => {
      console.log("[Notifications] Disconnected:", reason);
    });

    _socket.on("connect_error", (err) => {
      console.warn("[Notifications] Connection error:", err.message);
    });

    // Debug: log ALL incoming events
    _socket.onAny((event, ...args) => {
      console.log("[Notifications] Received event:", event, args);
    });
  }
  return _socket;
}

function showToast(title, body) {
  const existing = document.getElementById("crunch-toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.id = "crunch-toast";
  toast.style.cssText = `
    position: fixed; bottom: 24px; right: 24px; z-index: 99999;
    background: #1A1A1A; color: #fff;
    padding: 14px 18px; border-left: 4px solid #FFC72C;
    font-family: 'Public Sans', sans-serif; font-size: 14px;
    max-width: 320px; box-shadow: 0 4px 20px rgba(0,0,0,0.35);
  `;
  toast.innerHTML = `
    <div style="font-weight:900;letter-spacing:0.5px;margin-bottom:4px;">${title}</div>
    <div style="opacity:0.85;line-height:1.4;">${body}</div>
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 5000);
}

function notify(title, body) {
  console.log("[Notifications] notify() called:", title, body);

  // Always show in-app toast
  showToast(title, body);

  // Also fire native notification if permitted (e.g. when tab is in background)
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification(title, { body, icon: "/vite.svg" });
  }
}

export function useNotifications({ userId, role }) {
  useEffect(() => {
    if (!userId) return;

    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    const socket = getSocket();

    // Join room
    _joinedRooms.add(userId);
    if (socket.connected) {
      socket.emit("join", { userId });
      console.log("[Notifications] Joining room:", userId);
    }

    // Remove any previous handlers for this role to avoid duplicates
    const prevHandler = _handlers.get(role);
    if (prevHandler) {
      const eventName = role === "admin" ? "new_order" : "order_status_updated";
      socket.off(eventName, prevHandler);
      console.log("[Notifications] Removed old handler for role:", role);
    }

    // Register fresh handler
    if (role === "admin") {
      const handler = (data) => {
        console.log("[Notifications] new_order event received:", data);
        const { customerName, orderType, total, itemCount } = data;
        notify(
          "🛎️ New Order Received!",
          `${customerName} placed a ${orderType} order — ` +
          `${itemCount} item${itemCount !== 1 ? "s" : ""} · ₱${total.toLocaleString()}`
        );
      };
      _handlers.set("admin", handler);
      socket.on("new_order", handler);
    }

    if (role === "customer") {
      const handler = (data) => {
        console.log("[Notifications] order_status_updated event received:", data);
        const { status, message } = data;
        const titles = {
          Pending: "⏳ Order Received",
          Preparing: "👨‍🍳 Order Being Prepared",
          Ready: "✅ Order Ready!",
          Delivered: "📦 Order Delivered",
        };
        notify(titles[status] || "Order Update", message);
      };
      _handlers.set("customer", handler);
      socket.on("order_status_updated", handler);
    }

    return () => {
      // Don't remove handlers on cleanup — let _handlers Map manage them
    };
  }, [userId, role]);
}