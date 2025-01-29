const mongoose = require("mongoose");

const tournamentResultSchema = new mongoose.Schema({
	tournamentId: { type: String, required: true },
	playerId: { type: String, required: true },
	playerName: { type: String, required: true },
	matches: [
		{
			roundNumber: Number,
			opponent: {
				_id: String,
				chesscomUsername: String,
			},
			result: {
				type: String,
				enum: ["win", "loss", "draw", "pending"],
				default: "pending",
			},
			points: Number, // 1 for win, 0.5 for draw, 0 for loss
			playedAt: Date,
		},
	],
	totalPoints: { type: Number, default: 0 },
	wins: { type: Number, default: 0 },
	losses: { type: Number, default: 0 },
	draws: { type: Number, default: 0 },
	performanceRating: { type: Number, default: 0 },
});

module.exports = mongoose.model("TournamentResult", tournamentResultSchema);
