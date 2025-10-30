import { io } from "socket.io-client";
import { getCookie } from "./cookieHandler";
import { socketApiUrl } from "../hooks/axiosProvider";




let socket = null;


const initializeSocket = () => {
    // Default to user token
    let token = getCookie("VERIFIED_TOKEN")?.replace(/^"|"$/g, "");
    const activeMode = getCookie("ACTIVE_MODE"); // "company" | "institution" | undefined

    // Use TOKEN for company or institution if ACTIVE_MODE is set
    if (activeMode === "company" || activeMode === "institution") {
        token = getCookie("TOKEN")?.replace(/^"|"$/g, "");
    }
    // console.log(token)

    if (token) {
        socket = io(socketApiUrl, {
            auth: {
                token: `Bearer ${token}`,
            },
            autoConnect: false,
            transports: ["websocket"]
        });
    } else {
        console.warn("No token found for socket auth");
    }
};

export const reconnectSocket = () => {
    if (socket) {
        socket.disconnect();
    }
    initializeSocket();
    socket && socket.connect();
};

export const socketConnection = () => {
    if (!socket) {
        initializeSocket();
    }
    if (socket && !socket.connected) {
        socket.connect();
    }
    return socket;
};


export const sendTicketMessage = (messageData) => {
    const sock = socketConnection();
    if (sock) {
        sock.emit('new-ticket-message', messageData);
    }
};



export const isSocketConnected = () => {
    return socket && socket.connected;
};

export const getSocketId = () => {
    return socket ? socket.id : null;
};

// Event listener utilities
export const addSocketListener = (event, callback) => {
    const sock = socketConnection();
    if (sock) {
        sock.on(event, callback);
    }
};

export const removeSocketListener = (event, callback) => {
    if (socket) {
        if (callback) {
            socket.off(event, callback);
        } else {
            socket.off(event);
        }
    }
};

// Cleanup utility
export const cleanupSocket = () => {
    if (socket) {
        socket.removeAllListeners();
        socket.disconnect();
        socket = null;
    }
};