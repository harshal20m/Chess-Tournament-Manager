const express = require("express");
const router = express.Router();
const Player = require("../models/player.model");

router.get("/", async (req, res) => {
	try {
		const players = await Player.find().sort({ createdAt: -1 });
		res.json(players);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

module.exports = router;
