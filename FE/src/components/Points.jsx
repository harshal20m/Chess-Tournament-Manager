import React, { useState, useEffect } from "react";

const Points = () => {
	const [players, setPlayers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchPlayers = async () => {
			try {
				const response = await fetch("https://kuf4krkrb7.execute-api.ap-south-1.amazonaws.com/dev/api/players");
				if (!response.ok) throw new Error("Failed to fetch players");
				const data = await response.json();
				setPlayers(data);
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchPlayers();
	}, []);

	if (loading) return <div className="text-white text-center mt-8">Loading players...</div>;
	if (error) return <div className="text-red-500 text-center mt-8">{error}</div>;

	return (
		<div className="container mx-auto p-0 sm:p-4 max-w-4xl mb-6">
			<h2 className="text-3xl font-bold text-center mb-4 text-white px-2 pt-4">Points Table</h2>

			{/* Mobile View */}
			<div className="md:hidden space-y-0 sm:space-y-3">
				{players.map((player, index) => (
					<div
						key={player._id}
						className="bg-white/10 backdrop-blur-sm p-4 flex items-center justify-between border-b border-white/10"
					>
						<div className="flex items-center gap-4">
							<span className="text-xl font-bold text-white/90 min-w-[1.5rem]">#{index + 1}</span>
							<span className="text-white font-medium">{player.chesscomUsername}</span>
						</div>
						<div className="flex gap-4 text-center">
							<div>
								<div className="text-xs text-white/60">Points</div>
								<div className="text-white font-bold">0</div>
							</div>
							<div>
								<div className="text-xs text-white/60">Games</div>
								<div className="text-white font-bold">0</div>
							</div>
						</div>
					</div>
				))}
			</div>

			{/* Desktop View */}
			<div className="hidden md:block">
				<div className="w-full overflow-x-auto">
					<div className="min-w-[600px] lg:min-w-full">
						{" "}
						{/* Minimum width for small screens */}
						<table className="w-full border-collapse">
							<thead>
								<tr className="border-b border-white/10">
									<th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider w-20">
										Rank
									</th>
									<th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
										Player
									</th>
									<th className="px-6 py-4 text-center text-xs font-medium text-gray-300 uppercase tracking-wider w-32">
										Points
									</th>
									<th className="px-6 py-4 text-center text-xs font-medium text-gray-300 uppercase tracking-wider w-32">
										Games
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-white/5">
								{players.map((player, index) => (
									<tr key={player._id} className="hover:bg-white/5 transition-colors">
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="flex items-center">
												<span
													className={`
													h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold
													${index < 3 ? "bg-gradient-to-r from-yellow-500/80 to-amber-600/80 text-white" : "bg-white/10 text-gray-300"}
												`}
												>
													{index + 1}
												</span>
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="text-sm font-medium text-white">
												{player.chesscomUsername}
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-center">
											<span className="px-3 py-1 text-sm text-white/90 font-semibold">0</span>
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-center">
											<span className="px-3 py-1 text-sm text-white/90 font-semibold">0</span>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Points;
