const express = require("express");
const router = express.Router();
const Matchup = require("../models/matchup");
const TournamentResult = require("../models/tournamentResult"); // Add this

// Helper function to check if a pair has been used in any round
const isPairUsed = (player1Id, player2Id, allMatches) => {
	return allMatches.some(
		(match) =>
			(match.player1._id === player1Id && match.player2._id === player2Id) ||
			(match.player1._id === player2Id && match.player2._id === player1Id)
	);
};

router.post("/generate-rounds", async (req, res) => {
	try {
		const { players, numberOfRounds, tournamentId } = req.body;

		// Initialize tournament results first
		await TournamentResult.deleteMany({ tournamentId });
		await Promise.all(
			players.map((player) =>
				TournamentResult.create({
					tournamentId,
					playerId: player._id,
					playerName: player.chesscomUsername,
					matches: [],
				})
			)
		);

		const matchups = [];
		const allMatches = []; // Keep track of all matches across rounds

		// Delete existing matchups
		await Matchup.deleteMany({ tournamentId });

		for (let round = 1; round <= numberOfRounds; round++) {
			const availablePlayers = [...players];
			const matches = [];

			while (availablePlayers.length > 1) {
				let validPairFound = false;
				const player1 = availablePlayers[0]; // Take first player

				// Try to find a valid opponent for player1
				for (let j = 1; j < availablePlayers.length; j++) {
					const player2 = availablePlayers[j];

					// Check if this pair hasn't played before
					if (!isPairUsed(player1._id, player2._id, allMatches)) {
						matches.push({
							player1: {
								_id: player1._id,
								chesscomUsername: player1.chesscomUsername,
							},
							player2: {
								_id: player2._id,
								chesscomUsername: player2.chesscomUsername,
							},
						});
						allMatches.push(matches[matches.length - 1]); // Add to all matches
						availablePlayers.splice(j, 1); // Remove player2
						availablePlayers.shift(); // Remove player1
						validPairFound = true;
						break;
					}
				}

				// If no valid pair found for player1
				if (!validPairFound) {
					// Force pair with next available player if we're running out of options
					if (round === numberOfRounds || availablePlayers.length <= 3) {
						const player2 = availablePlayers[1];
						matches.push({
							player1: {
								_id: player1._id,
								chesscomUsername: player1.chesscomUsername,
							},
							player2: {
								_id: player2._id,
								chesscomUsername: player2.chesscomUsername,
							},
						});
						allMatches.push(matches[matches.length - 1]);
						availablePlayers.splice(1, 1);
						availablePlayers.shift();
					} else {
						// Move player1 to the end and try again in next iteration
						const skippedPlayer = availablePlayers.shift();
						availablePlayers.push(skippedPlayer);
					}
				}
			}

			// Handle odd player out
			if (availablePlayers.length === 1) {
				matches.push({
					player1: {
						_id: availablePlayers[0]._id,
						chesscomUsername: availablePlayers[0].chesscomUsername,
					},
					player2: {
						_id: "bye",
						chesscomUsername: "BYE",
					},
				});
			}

			const matchup = new Matchup({
				round,
				matches,
				tournamentId,
			});
			await matchup.save();
			matchups.push(matchup);
		}

		res.json(matchups);
	} catch (error) {
		console.error("Error:", error);
		res.status(500).json({ message: error.message });
	}
});

router.post("/update-result", async (req, res) => {
	try {
		const { tournamentId, roundNumber, player1Id, player2Id, result } = req.body;

		const matchup = await Matchup.findOne({
			tournamentId,
			round: roundNumber,
		});

		if (!matchup) {
			throw new Error("Matchup not found");
		}

		const match = matchup.matches.find(
			(m) =>
				(m.player1._id === player1Id && m.player2._id === player2Id) ||
				(m.player1._id === player2Id && m.player2._id === player1Id)
		);

		if (match) {
			match.result = result;
			await matchup.save();
		}

		res.json({ success: true });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

router.get("/tournament/:tournamentId", async (req, res) => {
	try {
		const matchups = await Matchup.find({ tournamentId: req.params.tournamentId });
		res.json(matchups);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

module.exports = router;
