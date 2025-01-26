const express = require("express");
const router = express.Router();
const Registration = require("../models/registration.model");
const Player = require("../models/player.model");

router.post("/", async (req, res) => {
	try {
		// Basic validation
		const { fullName, email, phoneNumber, playingLevel, chesscomUsername } = req.body;
		if (!fullName || !email || !phoneNumber || !playingLevel || !chesscomUsername) {
			return res.status(400).json({ message: "Required fields are missing" });
		}

		// Validate email format
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return res.status(400).json({ message: "Invalid email format" });
		}

		// Validate playing level
		const validLevels = ["beginner", "intermediate", "advanced", "master"];
		if (!validLevels.includes(playingLevel)) {
			return res.status(400).json({ message: "Invalid playing level" });
		}

		// Check for existing registration with same email
		const existingRegistration = await Registration.findOne({ email });
		if (existingRegistration) {
			return res.status(400).json({
				message: "This email is already registered for the tournament",
			});
		}

		// Create registration
		const registration = new Registration(req.body);
		const newRegistration = await registration.save();

		// Check if player already exists
		const existingPlayer = await Player.findOne({ chesscomUsername });

		// Create player record if doesn't exist and it's a new registration
		if (!existingPlayer && !newRegistration.isUpdate) {
			const player = new Player({
				chesscomUsername,
				registrationId: newRegistration._id,
			});
			await player.save();
		}

		res.status(201).json({
			message: "Registration successful",
			data: newRegistration,
		});
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
});

// Get all registrations (optional - for admin purposes)
router.get("/", async (req, res) => {
	try {
		const registrations = await Registration.find().sort({ createdAt: -1 });
		res.json(registrations);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

module.exports = router;
