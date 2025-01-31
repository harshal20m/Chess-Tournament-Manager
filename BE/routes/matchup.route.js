const express = require("express");
const router = express.Router();
const Matchup = require("../models/matchup");
const TournamentResult = require("../models/tournamentResult");

// Helper function to create a unique pair key
const getPairKey = (player1Id, player2Id) => {
	const ids = [player1Id.toString(), player2Id.toString()].sort();
	return ids.join("-");
};

// Helper function to check if a pair has been used
const isPairUsed = (player1Id, player2Id, usedPairs) => {
	const pairKey = getPairKey(player1Id, player2Id);
	return usedPairs.has(pairKey);
};

// Helper function to get player's previous opponents
const getPlayerOpponents = (playerId, allMatches) => {
	return allMatches
		.filter(
			(match) =>
				match.player1._id.toString() === playerId.toString() ||
				match.player2._id.toString() === playerId.toString()
		)
		.map((match) =>
			match.player1._id.toString() === playerId.toString()
				? match.player2._id.toString()
				: match.player1._id.toString()
		);
};

// Helper function to score potential pairing
const scorePairing = (player1Id, player2Id, usedPairs, allMatches, round, totalRounds) => {
	const pairKey = getPairKey(player1Id, player2Id);
	if (usedPairs.has(pairKey)) {
		return -1000; // Heavy penalty for repeated pairs
	}

	let score = 100;
	const player1Opponents = getPlayerOpponents(player1Id, allMatches);
	const player2Opponents = getPlayerOpponents(player2Id, allMatches);

	// Penalize based on number of common opponents
	const commonOpponents = player1Opponents.filter((op) => player2Opponents.includes(op));
	score -= commonOpponents.length * 10;

	// Penalize based on games played against each other
	const gamesAgainstEachOther = allMatches.filter(
		(match) =>
			(match.player1._id.toString() === player1Id.toString() &&
				match.player2._id.toString() === player2Id.toString()) ||
			(match.player1._id.toString() === player2Id.toString() &&
				match.player2._id.toString() === player1Id.toString())
	).length;
	score -= gamesAgainstEachOther * 50;

	// Consider round number (prefer new opponents in early rounds)
	score -= (round / totalRounds) * 20;

	return score;
};

router.post("/generate-rounds", async (req, res) => {
	console.log("Starting matchup generation...");
	const startTime = Date.now();

	try {
		const { players, numberOfRounds, tournamentId } = req.body;
		console.log(`Generating ${numberOfRounds} rounds for ${players.length} players`);

		// Clear existing data
		await Promise.all([TournamentResult.deleteMany({ tournamentId }), Matchup.deleteMany({ tournamentId })]);

		const matchups = [];
		const usedPairs = new Set();
		const allMatches = [];

		// Initialize tournament results
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

		for (let round = 1; round <= numberOfRounds; round++) {
			console.log(`Generating round ${round}...`);
			const matches = [];
			let roundPlayers = [...players];

			while (roundPlayers.length > 1) {
				const player1 = roundPlayers[0];
				let bestScore = -Infinity;
				let bestOpponent = null;
				let bestOpponentIndex = -1;

				// Find best opponent for player1
				for (let i = 1; i < roundPlayers.length; i++) {
					const player2 = roundPlayers[i];
					const score = scorePairing(player1._id, player2._id, usedPairs, allMatches, round, numberOfRounds);

					if (score > bestScore) {
						bestScore = score;
						bestOpponent = player2;
						bestOpponentIndex = i;
					}
				}

				if (bestOpponent) {
					const match = {
						player1: {
							_id: player1._id,
							chesscomUsername: player1.chesscomUsername,
						},
						player2: {
							_id: bestOpponent._id,
							chesscomUsername: bestOpponent.chesscomUsername,
						},
					};

					matches.push(match);
					allMatches.push(match);
					usedPairs.add(getPairKey(player1._id, bestOpponent._id));

					// Remove paired players
					roundPlayers = roundPlayers.filter(
						(p) =>
							p._id.toString() !== player1._id.toString() &&
							p._id.toString() !== bestOpponent._id.toString()
					);
				} else {
					// Fallback if no valid opponent found
					roundPlayers.shift();
				}
			}

			// Handle odd player out
			if (roundPlayers.length === 1) {
				matches.push({
					player1: {
						_id: roundPlayers[0]._id,
						chesscomUsername: roundPlayers[0].chesscomUsername,
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

			console.log(`Round ${round} completed with ${matches.length} matches`);
		}

		console.log(`Generation completed in ${(Date.now() - startTime) / 1000}s`);
		res.json(matchups);
	} catch (error) {
		console.error("Matchup generation failed:", error);
		res.status(500).json({
			message: "Failed to generate matchups",
			error: error.message,
		});
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
