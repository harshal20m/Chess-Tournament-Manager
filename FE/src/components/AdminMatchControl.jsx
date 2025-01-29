import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminMatchControl = () => {
	const [rounds, setRounds] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [currentRound, setCurrentRound] = useState(0);
	const [updating, setUpdating] = useState(false);
	const [showConfirmReset, setShowConfirmReset] = useState(false);
	const [isResetting, setIsResetting] = useState(false);
	const [confirmMatch, setConfirmMatch] = useState(null);
	const [completedMatches, setCompletedMatches] = useState(new Set());
	const navigate = useNavigate();

	useEffect(() => {
		// Check admin access
		const username = localStorage.getItem("username");
		const password = localStorage.getItem("password");
		if (username !== "harshal@gmail.com" || password !== "hm2002") {
			navigate("/");
			return;
		}

		loadMatchups();
	}, [navigate]);

	const loadMatchups = async () => {
		try {
			const response = await fetch("http://localhost:5000/api/matchups/tournament/current");
			if (response.ok) {
				const matchups = await response.json();
				setRounds(matchups);
			}
		} catch (error) {
			setError("Failed to load matchups");
		} finally {
			setLoading(false);
		}
	};

	const updateMatchResult = async (matchId, player1Id, player2Id, result) => {
		setUpdating(true);
		try {
			// First update tournament results
			const tournamentResponse = await fetch("http://localhost:5000/api/tournament-results/update-match", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					tournamentId: "current",
					roundNumber: currentRound + 1,
					player1Id,
					player2Id,
					result,
				}),
			});

			if (!tournamentResponse.ok) {
				throw new Error("Failed to update tournament results");
			}

			// Then update matchup result
			const matchupResponse = await fetch("http://localhost:5000/api/matchups/update-result", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					tournamentId: "current",
					roundNumber: currentRound + 1,
					player1Id,
					player2Id,
					result,
				}),
			});

			if (!matchupResponse.ok) {
				throw new Error("Failed to update matchup result");
			}

			// Reload matchups to show updated state
			await loadMatchups();
		} catch (error) {
			console.error("Error details:", error);
			setError(error.message || "Failed to update match result");
		} finally {
			setUpdating(false);
		}
	};

	const handleReset = async () => {
		setIsResetting(true);
		try {
			const response = await fetch("http://localhost:5000/api/tournament-results/reset-tournament", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ tournamentId: "current" }),
			});

			if (!response.ok) throw new Error("Failed to reset tournament");

			await loadMatchups();
			setShowConfirmReset(false);
		} catch (error) {
			setError("Failed to reset tournament data");
		} finally {
			setIsResetting(false);
		}
	};

	const handleMatchUpdate = (matchId, player1Id, player2Id, result) => {
		setConfirmMatch({
			matchId,
			player1Id,
			player2Id,
			result,
			player1Name: rounds[currentRound]?.matches?.find((m) => m._id === matchId)?.player1.chesscomUsername,
			player2Name: rounds[currentRound]?.matches?.find((m) => m._id === matchId)?.player2.chesscomUsername,
		});
	};

	const confirmAndUpdate = async () => {
		if (!confirmMatch) return;

		const { matchId, player1Id, player2Id, result } = confirmMatch;
		await updateMatchResult(matchId, player1Id, player2Id, result);
		setCompletedMatches((prev) => new Set([...prev, matchId]));
		setConfirmMatch(null);
	};

	if (loading) return <div className="text-white text-center mt-8">Loading...</div>;
	if (error) return <div className="text-red-500 text-center mt-8">{error}</div>;

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-2 sm:p-4">
			<div className="max-w-4xl mx-auto">
				<div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
					<h1 className="text-2xl sm:text-3xl font-bold text-white">Admin Match Control</h1>
					<button
						onClick={() => setShowConfirmReset(true)}
						className="w-full sm:w-auto px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-500 
								 rounded-lg border border-red-500/50 transition-all duration-300"
						disabled={isResetting}
					>
						{isResetting ? "Resetting..." : "Reset Tournament"}
					</button>
				</div>

				{/* Round Selection */}
				<div className="flex overflow-x-auto pb-2 mb-4 sm:mb-6 gap-1 sm:gap-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
					<div className="flex space-x-1 sm:space-x-2 px-2 sm:px-0">
						{rounds.map((_, index) => (
							<button
								key={index}
								onClick={() => setCurrentRound(index)}
								className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg whitespace-nowrap text-sm sm:text-base
								${currentRound === index ? "bg-blue-500 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`}
							>
								Round {index + 1}
							</button>
						))}
					</div>
				</div>

				{/* Matches Grid */}
				<div className="grid gap-3 sm:gap-4">
					{rounds[currentRound]?.matches?.map((match, index) => (
						<div key={index} className="bg-gray-800 rounded-lg p-3 sm:p-4">
							<div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
								<div className="flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-4 w-full">
									<span className="text-white text-center sm:text-right w-full sm:w-1/3">
										{match.player1.chesscomUsername}
									</span>
									{!completedMatches.has(match._id) ? (
										<div className="flex gap-2 justify-center w-full sm:w-auto">
											<button
												onClick={() =>
													handleMatchUpdate(
														match._id,
														match.player1._id,
														match.player2._id,
														"win"
													)
												}
												className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm sm:text-base"
												disabled={updating}
											>
												Win
											</button>
											<button
												onClick={() =>
													handleMatchUpdate(
														match._id,
														match.player1._id,
														match.player2._id,
														"draw"
													)
												}
												className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white rounded text-sm sm:text-base"
												disabled={updating}
											>
												Draw
											</button>
											<button
												onClick={() =>
													handleMatchUpdate(
														match._id,
														match.player1._id,
														match.player2._id,
														"loss"
													)
												}
												className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm sm:text-base"
												disabled={updating}
											>
												Loss
											</button>
										</div>
									) : (
										<div className="px-3 py-1 bg-gray-700 text-gray-400 rounded text-sm sm:text-base">
											Result Recorded
										</div>
									)}
									<span className="text-white text-center sm:text-left w-full sm:w-1/3">
										{match.player2.chesscomUsername}
									</span>
								</div>
							</div>
							{match.result && (
								<div className="mt-2 text-center text-xs sm:text-sm text-gray-400">
									Current result: {match.result}
								</div>
							)}
						</div>
					))}
				</div>

				{/* Confirmation Dialog */}
				{confirmMatch && (
					<div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
						<div className="bg-gray-800 rounded-lg p-6 max-w-md w-full border border-white/10">
							<h2 className="text-xl font-bold text-white mb-4">Confirm Result</h2>
							<p className="text-gray-300 mb-6">
								Are you sure you want to record this result?
								<br />
								<span className="font-semibold">{confirmMatch.player1Name}</span>{" "}
								{confirmMatch.result.toUpperCase()} against{" "}
								<span className="font-semibold">{confirmMatch.player2Name}</span>
							</p>
							<div className="flex gap-4 justify-end">
								<button
									onClick={() => setConfirmMatch(null)}
									className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
									disabled={updating}
								>
									Cancel
								</button>
								<button
									onClick={confirmAndUpdate}
									className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
									disabled={updating}
								>
									{updating ? "Updating..." : "Confirm"}
								</button>
							</div>
						</div>
					</div>
				)}

				{/* Confirmation Dialog */}
				{showConfirmReset && (
					<div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
						<div className="bg-gray-800 rounded-lg p-6 max-w-md w-full border border-white/10">
							<h2 className="text-xl font-bold text-white mb-4">Confirm Reset</h2>
							<p className="text-gray-300 mb-6">
								This will reset all match results and tournament standings. This action cannot be
								undone.
							</p>
							<div className="flex gap-4 justify-end">
								<button
									onClick={() => setShowConfirmReset(false)}
									className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
									disabled={isResetting}
								>
									Cancel
								</button>
								<button
									onClick={handleReset}
									className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
									disabled={isResetting}
								>
									{isResetting ? "Resetting..." : "Reset"}
								</button>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default AdminMatchControl;
