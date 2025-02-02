import React, { useState, useEffect } from "react";

const Matchups = () => {
	const [players, setPlayers] = useState([]);
	const [rounds, setRounds] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [currentRound, setCurrentRound] = useState(0);
	const [isSaving, setIsSaving] = useState(false);
	const [isAdmin, setIsAdmin] = useState(false);

	useEffect(() => {
		// Simplified admin check
		const username = localStorage.getItem("username");
		const password = localStorage.getItem("password");
		const isAdmin = username === "harshal@gmail.com" && password === "hm2002";
		setIsAdmin(isAdmin);

		const fetchPlayers = async () => {
			try {
				const response = await fetch("https://kuf4krkrb7.execute-api.ap-south-1.amazonaws.com/dev/api/players");
				if (!response.ok) throw new Error("Failed to fetch players");
				const data = await response.json();
				setPlayers(data);
				await loadExistingMatchups(); // Try to load existing matchups first
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchPlayers();
	}, []);

	const loadExistingMatchups = async () => {
		try {
			const response = await fetch(
				"https://kuf4krkrb7.execute-api.ap-south-1.amazonaws.com/dev/api/matchups/tournament/current"
			); // Adjust the tournamentId as needed
			if (response.ok) {
				const matchups = await response.json();
				if (matchups.length > 0) {
					// No need to map matches, use the data directly
					setRounds(matchups);
					return true;
				}
			}
			return false;
		} catch (error) {
			console.error("Error loading matchups:", error);
			return false;
		}
	};

	const generateAllRounds = async (players) => {
		setIsSaving(true);
		try {
			const totalRounds = 5;
			const allRounds = [];
			const usedPairs = new Set();

			for (let round = 0; round < totalRounds; round++) {
				const roundMatches = [];
				const availablePlayers = [...players];

				while (availablePlayers.length > 1) {
					let validPairFound = false;
					let attempts = 0;
					const maxAttempts = availablePlayers.length * 2;

					while (!validPairFound && attempts < maxAttempts) {
						const player1Index = 0;
						const player2Index = Math.floor(Math.random() * (availablePlayers.length - 1)) + 1;
						const player1 = availablePlayers[player1Index];
						const player2 = availablePlayers[player2Index];

						// Create a unique pair identifier
						const pairId = `${player1._id}-${player2._id}`;
						const reversePairId = `${player2._id}-${player1._id}`;

						if (!usedPairs.has(pairId) && !usedPairs.has(reversePairId)) {
							roundMatches.push({
								player1,
								player2,
								roundNumber: round + 1,
							});
							usedPairs.add(pairId);
							availablePlayers.splice(player2Index, 1);
							availablePlayers.splice(player1Index, 1);
							validPairFound = true;
						}
						attempts++;
					}

					if (!validPairFound) {
						// If no valid pair found, just pair the next available players
						const player1 = availablePlayers.shift();
						const player2 = availablePlayers.shift();
						if (player1 && player2) {
							roundMatches.push({
								player1,
								player2,
								roundNumber: round + 1,
							});
						}
					}
				}

				// Handle odd number of players
				if (availablePlayers.length === 1) {
					roundMatches.push({
						player1: availablePlayers[0],
						player2: { chesscomUsername: "Bye" },
						roundNumber: round + 1,
					});
				}

				allRounds.push(roundMatches);
			}

			// Save generated rounds to backend
			const response = await fetch(
				"https://kuf4krkrb7.execute-api.ap-south-1.amazonaws.com/dev/api/matchups/generate-rounds",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						players,
						numberOfRounds: totalRounds,
						tournamentId: "current", // Adjust as needed
					}),
				}
			);

			if (!response.ok) throw new Error("Failed to save matchups");

			const savedMatchups = await response.json();
			setRounds(savedMatchups.map((m) => m.matches));
		} catch (err) {
			setError(err.message);
			console.error("Failed to generate and save matchups:", err);
		} finally {
			setIsSaving(false);
		}
	};

	if (loading) return <div className="text-white text-center mt-8">Loading matchups...</div>;
	if (error) return <div className="text-red-500 text-center mt-8">{error}</div>;

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-2 sm:p-4 md:p-8">
			<div className="fixed inset-0 opacity-30 pointer-events-none">
				<div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
			</div>

			<div className="relative z-10 max-w-4xl mx-auto">
				<h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
					Tournament Matchups
				</h2>

				{/* Round Selection - Scrollable on mobile */}
				<div className="flex overflow-x-auto pb-2 mb-4 sm:mb-6 gap-1 sm:gap-2 justify-start sm:justify-center">
					<div className="flex space-x-1 sm:space-x-2 px-2 sm:px-0">
						{rounds.map((_, index) => (
							<button
								key={index}
								onClick={() => setCurrentRound(index)}
								className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-all duration-300 whitespace-nowrap text-sm sm:text-base
									${currentRound === index ? "bg-blue-500 text-white" : "bg-white/10 text-white/70 hover:bg-white/20"}`}
							>
								Round {index + 1}
							</button>
						))}
					</div>
				</div>

				{/* Matchups Display */}
				<div className="grid grid-cols-2 gap-2 sm:gap-4">
					{rounds[currentRound]?.matches?.map((match, index) => (
						<div
							key={index}
							className="bg-white/10 backdrop-blur-md rounded-lg p-3 sm:p-6 border border-white/10
                                     hover:bg-white/20 transition-all duration-300"
						>
							<div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
								<div className="flex-1 text-center sm:text-right">
									<span className="text-sm sm:text-base text-white font-medium">
										{match.player1.chesscomUsername}
									</span>
								</div>

								<div className="flex flex-row sm:flex-col items-center px-2 sm:px-4">
									<span className="text-white font-bold text-sm sm:text-base">VS</span>
								</div>

								<div className="flex-1 text-center sm:text-left">
									<span className="text-sm sm:text-base text-white font-medium">
										{match.player2.chesscomUsername}
									</span>
								</div>
							</div>
						</div>
					))}
				</div>

				{/* Only show regenerate button for admin */}
				{isAdmin && (
					<button
						onClick={() => generateAllRounds(players)}
						disabled={isSaving}
						className={`mt-4 sm:mt-6 mx-auto block px-4 sm:px-6 py-2 
							${isSaving ? "bg-gray-500/20 cursor-not-allowed" : "bg-blue-500/20 hover:bg-blue-500/30"} 
							text-white text-sm sm:text-base rounded-full border 
							border-blue-500/50 transition-all duration-300`}
					>
						{isSaving ? "Saving..." : "Regenerate All Rounds"}
					</button>
				)}

				{error && <div className="mt-4 text-red-400 text-center">{error}</div>}
			</div>
		</div>
	);
};

export default Matchups;
