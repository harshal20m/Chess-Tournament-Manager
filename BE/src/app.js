const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
mongoose
	.connect(process.env.MONGODB_URI)
	.then(() => console.log("MongoDB connected"))
	.catch((err) => console.error("MongoDB connection error:", err));

// Routes
const registrationRoutes = require("../routes/registration.routes");
const playerRoutes = require("../routes/player.routes");
const authRoutes = require("../routes/auth.routes");
const messagesRoutes = require("../routes/messages.routes");

// Use routes
app.use("/api/players", playerRoutes);
app.use("/api/register", registrationRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/messages", messagesRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
	res.status(200).json({ status: "ok" });
});

// Error handling
app.use((err, req, res, next) => {
	res.status(500).json({ message: err.message });
});

module.exports = { app };
