# The Crunch — Notification Server

Express + Socket.IO backend that delivers real-time notifications to customers
and admins without polling Firestore from the browser.

---

## How it works

```
Firestore (orders collection)
        │
        │  Firebase Admin SDK onSnapshot listener
        ▼
  Express Server  (server/index.js)
        │
        │  Socket.IO event emission
        ├──► room "admin"          → new_order event
        └──► room "<userId>"       → order_status_updated event
        │
        ▼
  React Frontend  (src/useNotifications.js)
        │
        ├──► Browser Notification API  (if permission granted)
        └──► In-page toast             (fallback)
```

### Events

| Event | Room | Payload | Triggered when |
|---|---|---|---|
| `new_order` | `admin` | `{ orderId, customerName, orderType, total, itemCount }` | A new order document is created in Firestore |
| `order_status_updated` | `<userId>` | `{ orderId, status, message }` | An existing order's `status` field changes |

---

## Setup

### 1. Get your Firebase service account key

1. Go to [Firebase Console](https://console.firebase.google.com) → your project
2. Project Settings → **Service Accounts** tab
3. Click **Generate new private key** → download the JSON file
4. Rename it to `serviceAccountKey.json` and place it in this `/server` folder

> ⚠️ **Never commit this file.** It's already in `.gitignore`.

### 2. Create your `.env`

```bash
cp .env.example .env
```

Edit `.env` if needed (defaults work for local dev):

```
PORT=3001
CLIENT_ORIGIN=http://localhost:5173
```

### 3. Install dependencies

```bash
cd server
npm install
```

### 4. Run the server

```bash
# Development (auto-restarts on file changes, Node 18+)
npm run dev

# Production
npm start
```

---

## Frontend setup

### 1. Install socket.io-client

From the **root** of the project:

```bash
npm install socket.io-client
```

(Already added to `package.json` — just run `npm install`.)

### 2. Create your frontend `.env`

In the **root** of the project:

```bash
cp .env.example .env
```

Contents:
```
VITE_NOTIFICATION_SERVER=http://localhost:3001
```

### 3. The hook is already wired in

`useNotifications` is imported and called inside:
- `src/MyOrders.jsx` — listens for `order_status_updated` (customer role)
- `src/Admin_Panel.jsx` — listens for `new_order` (admin role)

No further changes needed.

---

## Running both together (local dev)

Open two terminals:

```bash
# Terminal 1 — React frontend
npm run dev

# Terminal 2 — Notification server
cd server && npm run dev
```

---

## Production notes

- Deploy the server anywhere Node.js runs (Railway, Render, Fly.io, a VPS, etc.)
- Update `VITE_NOTIFICATION_SERVER` in your frontend env to the deployed server URL
- Update `CLIENT_ORIGIN` in `server/.env` to your production frontend URL
- Socket.IO works over HTTPS — no extra config needed as long as your host provides TLS
