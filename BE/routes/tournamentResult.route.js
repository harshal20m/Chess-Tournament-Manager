const express = require("express");
const router = express.Router();
const TournamentResult = require("../models/tournamentResult");
const Matchup = require("../models/matchup");

// Add this at the top for better error logging
const logError = (error, context) => {
	console.error("=== Error Details ===");
	console.error("Context:", context);
	console.error("Message:", error.message);
	console.error("Stack:", error.stack);
	console.error("Full error:", error);
	console.error("==================");
};

// Initialize tournament results for all players
router.post("/initialize", async (req, res) => {
	try {
		const { tournamentId, players } = req.body;

		// Create result entries for each player
		const results = await Promise.all(
			players.map((player) => {
				return TournamentResult.create({
					tournamentId,
					playerId: player._id,
					playerName: player.chesscomUsername,
					matches: [],
				});
			})
		);

		res.json(results);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

router.post("/update-match", async (req, res) => {
	try {
		const { tournamentId, roundNumber, player1Id, player2Id, result } = req.body;

		// Log the incoming request data
		console.log("Received update request:", {
			tournamentId,
			roundNumber,
			player1Id,
			player2Id,
			result,
		});

		if (!tournamentId || !roundNumber || !player1Id || !player2Id || !result) {
			throw new Error("Missing required fields");
		}

		// Calculate points
		let player1Points = 0;
		let player2Points = 0;
		if (result === "win") {
			player1Points = 1;
			player2Points = 0;
		} else if (result === "loss") {
			player1Points = 0;
			player2Points = 1;
		} else if (result === "draw") {
			player1Points = 0.5;
			player2Points = 0.5;
		}

		try {
			// Update both players' results
			await Promise.all([
				updatePlayerResult(tournamentId, roundNumber, player1Id, player2Id, result, player1Points),
				updatePlayerResult(
					tournamentId,
					roundNumber,
					player2Id,
					player1Id,
					result === "win" ? "loss" : result === "loss" ? "win" : "draw",
					player2Points
				),
			]);
		} catch (updateError) {
			logError(updateError, "Failed during player result update");
			throw updateError;
		}

		res.json({ message: "Match result updated successfully" });
	} catch (error) {
		logError(error, "Update match endpoint");
		res.status(500).json({
			message: error.message,
			details: process.env.NODE_ENV === "development" ? error.stack : undefined,
		});
	}
});

// Add reset endpoint
router.post("/reset-tournament", async (req, res) => {
	try {
		const { tournamentId } = req.body;

		// Reset tournament results
		await TournamentResult.updateMany(
			{ tournamentId },
			{
				$set: {
					matches: [],
					totalPoints: 0,
					wins: 0,
					losses: 0,
					draws: 0,
				},
			}
		);

		// Reset matchup results
		await Matchup.updateMany({ tournamentId }, { $set: { "matches.$[].result": "pending" } });

		res.json({ message: "Tournament reset successfully" });
	} catch (error) {
		logError(error, "Reset tournament endpoint");
		res.status(500).json({ message: error.message });
	}
});

// Get player's tournament performance
router.get("/player/:tournamentId/:playerId", async (req, res) => {
	try {
		const result = await TournamentResult.findOne({
			tournamentId: req.params.tournamentId,
			playerId: req.params.playerId,
		});
		res.json(result);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// Get tournament standings
router.get("/standings/:tournamentId", async (req, res) => {
	try {
		const standings = await TournamentResult.find({
			tournamentId: req.params.tournamentId,
		}).sort({ totalPoints: -1, wins: -1 });
		res.json(standings);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// Helper function to update individual player's result
async function updatePlayerResult(tournamentId, roundNumber, playerId, opponentId, result, points) {
	console.log("Updating player result:", {
		tournamentId,
		roundNumber,
		playerId,
		opponentId,
		result,
		points,
	});

	let playerResult = await TournamentResult.findOne({
		tournamentId,
		playerId,
	});

	if (!playerResult) {
		console.log("Player result not found, creating new record");
		try {
			// Update matchup query to check both player1 and player2
			const matchup = await Matchup.findOne({
				tournamentId,
				$or: [{ "matches.player1._id": playerId }, { "matches.player2._id": playerId }],
			});

			if (!matchup) {
				console.log("No matchup found with query:", {
					tournamentId,
					playerId,
				});
				throw new Error(`No matchup found for player: ${playerId}`);
			}

			// Find the match containing the player
			const match = matchup.matches.find((m) => m.player1._id === playerId || m.player2._id === playerId);

			if (!match) {
				throw new Error(`No match found for player: ${playerId}`);
			}

			// Get the correct player data
			const playerData = match.player1._id === playerId ? match.player1 : match.player2;

			console.log("Creating new tournament result with player data:", playerData);

			playerResult = await TournamentResult.create({
				tournamentId,
				playerId,
				playerName: playerData.chesscomUsername,
				matches: [],
			});
		} catch (error) {
			logError(error, "Failed to create new player result");
			throw error;
		}
	}

	// Update match result with error handling
	try {
		const matchIndex = playerResult.matches.findIndex((m) => m.roundNumber === roundNumber);
		if (matchIndex >= 0) {
			playerResult.matches[matchIndex].result = result;
			playerResult.matches[matchIndex].points = points;
		} else {
			let opponentName = "Unknown";
			try {
				const opponent = await TournamentResult.findOne({ playerId: opponentId });
				if (opponent) {
					opponentName = opponent.playerName;
				}
			} catch (err) {
				console.error("Error finding opponent:", err);
			}

			playerResult.matches.push({
				roundNumber,
				opponent: {
					_id: opponentId,
					chesscomUsername: opponentName,
				},
				result,
				points,
				playedAt: new Date(),
			});
		}

		// Update total statistics
		playerResult.totalPoints = playerResult.matches.reduce((sum, m) => sum + (m.points || 0), 0);
		playerResult.wins = playerResult.matches.filter((m) => m.result === "win").length;
		playerResult.losses = playerResult.matches.filter((m) => m.result === "loss").length;
		playerResult.draws = playerResult.matches.filter((m) => m.result === "draw").length;

		await playerResult.save();
	} catch (err) {
		console.error("Error updating player result:", err);
		throw err;
	}
}

module.exports = router;
