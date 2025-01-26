const express = require("express");
const router = express.Router();
const User = require("../models/user.model");

router.post("/register", async (req, res) => {
	try {
		const { username, password } = req.body;

		const existingUser = await User.findOne({ username });
		if (existingUser) {
			return res.status(400).json({ message: "Username already exists" });
		}

		const user = new User({ username, password });
		await user.save();

		res.status(201).json({ message: "User created successfully" });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

router.post("/login", async (req, res) => {
	try {
		const { username, password } = req.body;
		const user = await User.findOne({ username });

		if (!user || user.password !== password) {
			return res.status(401).json({ message: "Invalid credentials" });
		}

		res.json({
			message: "Login successful",
			user: { id: user._id, username: user.username },
		});
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

module.exports = router;
