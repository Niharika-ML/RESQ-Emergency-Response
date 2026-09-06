const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "RESQ Backend is running 🚑",
    });
});

app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "RESQ server is healthy ❤️",
        database:
            mongoose.connection.readyState === 1
                ? "connected"
                : "disconnected",
    });
});

const PORT = process.env.PORT || 5000;

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("✅ MongoDB connected successfully");

        app.listen(PORT, () => {
            console.log(
                `🚑 RESQ Backend running on http://localhost:${PORT}`
            );
        });
    })
    .catch((error) => {
        console.error("❌ MongoDB connection failed");
        console.error(error.message);
    });