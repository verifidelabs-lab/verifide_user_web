import { io } from "socket.io-client";
import { getCookie } from "./cookieHandler";
import { socketApiUrl } from "../hooks/axiosProvider";

let socket = null;

/**
 * Initialize a socket connection with proper authentication
 */
const initializeSocket = () => {
  try {
    // Default: use user token
    let token = getCookie("VERIFIED_TOKEN")?.replace(/^"|"$/g, "");
    const activeMode = getCookie("ACTIVE_MODE"); // company | institution | undefined

    // Use organization token if in company/institution mode
    if (activeMode === "company" || activeMode === "institution") {
      token = getCookie("TOKEN")?.replace(/^"|"$/g, "");
    }

    if (!token) {
      console.warn("[Socket] ❌ No token found. Socket will not initialize.");
      return;
    }

    console.log("[Socket] 🪄 Initializing socket with auth token...");
    socket = io(socketApiUrl, {
      auth: { token: `Bearer ${token}` },
      autoConnect: false,
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log(`[Socket] ✅ Connected (ID: ${socket.id})`);
    });

    socket.on("disconnect", (reason) => {
      console.warn(`[Socket] ⚠️ Disconnected. Reason: ${reason}`);
    });

    socket.on("connect_error", (error) => {
      console.error("[Socket] 🚨 Connection error:", error.message);
    });
  } catch (err) {
    console.error("[Socket] ❌ Error initializing socket:", err);
  }
};

/**
 * Reconnect the socket with fresh initialization
 */
export const reconnectSocket = () => {
  console.log("[Socket] ♻️ Reconnecting socket...");
  if (socket) {
    socket.disconnect();
  }
  initializeSocket();
  if (socket) socket.connect();
};

/**
 * Get active socket or initialize a new one if not present
 */
export const socketConnection = () => {
  if (!socket) {
    console.log("[Socket] ⚙️ No active socket found. Initializing...");
    initializeSocket();
  }
  if (socket && !socket.connected) {
    console.log("[Socket] 🔌 Connecting socket...");
    socket.connect();
  }
  return socket;
};

/**
 * Emit ticket message event
 */
export const sendTicketMessage = (messageData) => {
  const sock = socketConnection();
  if (sock) {
    console.log("[Socket] 📩 Sending new ticket message:", messageData);
    sock.emit("new-ticket-message", messageData);
  } else {
    console.warn("[Socket] ❌ Cannot send message — socket not connected.");
  }
};

/**
 * Check if socket is connected
 */
export const isSocketConnected = () => {
  const status = socket && socket.connected;
  console.log(`[Socket] 🔍 Connected status: ${status}`);
  return status;
};

/**
 * Get current socket ID
 */
export const getSocketId = () => {
  const id = socket ? socket.id : null;
  console.log("[Socket] 🆔 Current socket ID:", id);
  return id;
};

/**
 * Add a socket event listener
 */
export const addSocketListener = (event, callback) => {
  const sock = socketConnection();
  if (sock) {
    console.log(`[Socket] 👂 Listening for event: "${event}"`);
    sock.on(event, callback);
  }
};

/**
 * Remove a specific or all socket listeners for an event
 */
export const removeSocketListener = (event, callback) => {
  if (!socket) return;
  if (callback) {
    console.log(`[Socket] 🚫 Removing listener for event: "${event}"`);
    socket.off(event, callback);
  } else {
    console.log(`[Socket] 🚫 Removing all listeners for event: "${event}"`);
    socket.off(event);
  }
};

/**
 * Cleanup all listeners and disconnect socket
 */
export const cleanupSocket = () => {
  if (socket) {
    console.log("[Socket] 🧹 Cleaning up socket...");
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }
};
