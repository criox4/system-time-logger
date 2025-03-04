const express = require("express");
const path = require("path");

const app = express();
const port = 3000;

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

// Log system time every 5 seconds

setInterval(() => {
    const timeData = getFormattedLocalTime();
    console.log(`🕒 System Time: ${timeData.formattedTime} | Day: ${timeData.dayOfWeek}`);
}, 5000);

// API route to get current system time
app.get("/api/time", (req, res) => {
    res.json(getFormattedLocalTime());
});

// Serve HTML page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start the server
app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
});
