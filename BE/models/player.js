const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema({
	chesscomUsername: { type: String, required: true },
	// Add any other player fields you need
});

module.exports = mongoose.model("Player", playerSchema);
