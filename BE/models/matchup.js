const mongoose = require("mongoose");

const matchupSchema = new mongoose.Schema({
	round: { type: Number, required: true },
	matches: [
		{
			player1: {
				_id: String,
				chesscomUsername: String,
				// ... any other player fields you need
			},
			player2: {
				_id: String,
				chesscomUsername: String,
				// ... any other player fields you need
			},
			result: { type: String, default: "pending" },
		},
	],
	tournamentId: { type: String, required: true },
	createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Matchup", matchupSchema);
