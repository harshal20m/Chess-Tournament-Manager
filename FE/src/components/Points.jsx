import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Points = () => {
	const [standings, setStandings] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		loadStandings();
	}, []);

	const loadStandings = async () => {
		try {
			const response = await fetch("http://localhost:5000/api/tournament-results/standings/current");
			if (!response.ok) throw new Error("Failed to load standings");
			const data = await response.json();
			setStandings(data);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	if (loading) return <div className="text-white text-center mt-8">Loading standings...</div>;
	if (error) return <div className="text-red-500 text-center mt-8">{error}</div>;

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 sm:p-6">
			<div className="max-w-4xl mx-auto">
				<h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400">
					Tournament Standings
				</h2>

				<div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden">
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead>
								<tr className="bg-white/5">
									<th className="px-4 py-3 text-left text-white font-semibold">Rank</th>
									<th className="px-4 py-3 text-left text-white font-semibold">Player</th>
									<th className="px-4 py-3 text-center text-white font-semibold">Points</th>
									<th className="px-4 py-3 text-center text-white font-semibold">W/D/L</th>
									<th className="px-4 py-3 text-center text-white font-semibold">Win Rate</th>
								</tr>
							</thead>
							<tbody>
								{standings.map((player, index) => {
									const totalGames = player.wins + player.draws + player.losses;
									const winRate =
										totalGames > 0
											? (((player.wins + player.draws * 0.5) / totalGames) * 100).toFixed(1)
											: "0.0";

									return (
										<tr
											key={player.playerId}
											className="border-t border-white/5 hover:bg-white/5 transition-colors"
										>
											<td className="px-4 py-3 text-white">
												{index + 1}
												{index < 3 && (
													<span className="ml-2">
														{index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
													</span>
												)}
											</td>
											<td className="px-4 py-3">
												<Link
													to={`/player/${player.playerName}`}
													className="text-blue-400 hover:text-blue-300 transition-colors"
												>
													{player.playerName}
												</Link>
											</td>
											<td className="px-4 py-3 text-center text-white font-medium">
												{player.totalPoints}
											</td>
											<td className="px-4 py-3 text-center text-white">
												{player.wins}/{player.draws}/{player.losses}
											</td>
											<td className="px-4 py-3 text-center text-white">{winRate}%</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				</div>

				<div className="mt-6 text-center text-sm text-white/60">Points: Win = 1, Draw = 0.5, Loss = 0</div>
			</div>
		</div>
	);
};

export default Points;
