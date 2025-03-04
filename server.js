const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const port = 3000;
const logHistory = []; // Cache logs

// Serve static files (for frontend)
app.use(express.static(path.join(__dirname, "public")));

// Function to get formatted local time
function getFormattedLocalTime() {
    const date = new Date();
    return {
        formattedTime: date.toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true
        }),
        dayOfWeek: date.toLocaleString("en-US", { weekday: "long" })
    };
}

// Function to add logs to cache and emit them
function addLog(message) {
    logHistory.push(message);
    if (logHistory.length > 50) {
        logHistory.shift(); // Keep only the last 50 logs
    }
    io.emit("log", message);
}

// Log system time every 30 seconds and cache logs
setInterval(() => {
    const timeData = getFormattedLocalTime();
    const logMessage = `🕒 System Time: ${timeData.formattedTime} | Day: ${timeData.dayOfWeek}`;
    
    console.log(logMessage);
    addLog(logMessage);
}, 5000);

// API route to get current system time
app.get("/api/time", (req, res) => {
    res.json(getFormattedLocalTime());
});

// WebSocket connection
io.on("connection", (socket) => {
    console.log("🔌 New client connected");

    // Send stored logs to new client
    socket.emit("logHistory", logHistory);

    socket.emit("log", "🔹 Connected to server log stream!");

    socket.on("disconnect", () => {
        console.log("🔌 Client disconnected");
    });
});

// Start the server
server.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
});
