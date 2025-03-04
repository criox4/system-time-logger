const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();
const port = 3000;

// Serve static files (for frontend)
app.use(express.static(path.join(__dirname, "public")));

// Function to fetch and format UTC time
async function fetchFormattedUTCTime() {
    try {
        const response = await axios.get("https://timeapi.io/api/time/current/zone?timeZone=UTC");
        const data = response.data;
        
        // Convert ISO Date to Readable Format
        const date = new Date(data.dateTime);
        const formattedTime = date.toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
            timeZone: "UTC"
        });

        return {
            formattedTime,
            date: data.date,
            timeZone: data.timeZone,
            dayOfWeek: data.dayOfWeek
        };

    } catch (error) {
        console.error("❌ Error fetching UTC time:", error.message);
        return null;
    }
}

// Log UTC time every 30 seconds
setInterval(async () => {
    const timeData = await fetchFormattedUTCTime();
    if (timeData) {
        console.log(`🕒 UTC Time: ${timeData.formattedTime} | Day: ${timeData.dayOfWeek}`);
    }
}, 10000);

// API route to get formatted UTC time
app.get("/api/time", async (req, res) => {
    const timeData = await fetchFormattedUTCTime();
    if (timeData) {
        res.json(timeData);
    } else {
        res.status(500).json({ error: "Failed to fetch UTC time" });
    }
});

// Serve HTML page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start the server
app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
});
