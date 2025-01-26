const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const registrationRoutes = require("./routes/registration.routes");
const playerRoutes = require("./routes/player.routes");
const authRoutes = require("./routes/auth.routes");
app.use("/api/players", playerRoutes);
app.use("/api/register", registrationRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/messages", require("./routes/messages.routes"));

// Error handling
app.use((err, req, res, next) => {
	res.status(500).json({ message: err.message });
});

// Connect to MongoDB
mongoose
	.connect(process.env.MONGODB_URI)
	.then(() => console.log("Connected to MongoDB"))
	.catch((err) => console.error("MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
