import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const HallOfFame = () => {
	const [players, setPlayers] = useState([]);
	const [playersData, setPlayersData] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		fetchPlayers();
	}, []);

	const fetchPlayers = async () => {
		try {
			const response = await fetch("https://kuf4krkrb7.execute-api.ap-south-1.amazonaws.com/dev/api/players");
			const data = await response.json();
			setPlayers(data);
			fetchPlayersData(data);
		} catch (err) {
			setError("Failed to fetch players");
		}
	};

	const fetchPlayersData = async (players) => {
		setLoading(true);
		try {
			const playersWithData = await Promise.all(
				players.map(async (player) => {
					try {
						const [profileResponse, statsResponse] = await Promise.all([
							fetch(`https://api.chess.com/pub/player/${player.chesscomUsername}`),
							fetch(`https://api.chess.com/pub/player/${player.chesscomUsername}/stats`),
						]);

						if (!profileResponse.ok || !statsResponse.ok) {
							throw new Error(`Failed to fetch data for ${player.chesscomUsername}`);
						}

						const profile = await profileResponse.json();
						const stats = await statsResponse.json();
						return { ...player, profile, stats };
					} catch (err) {
						return { ...player, error: true };
					}
				})
			);
			setPlayersData(playersWithData);
		} catch (err) {
			setError("Failed to fetch players data");
		} finally {
			setLoading(false);
		}
	};

	const getHighestRating = (player) => {
		if (player.error || !player.stats) return 0;

		const ratings = [
			player.stats?.chess_rapid?.last?.rating || 0,
			player.stats?.chess_blitz?.last?.rating || 0,
			player.stats?.chess_bullet?.last?.rating || 0,
		];

		return Math.max(...ratings);
	};

	const sortedPlayers = [...playersData].sort((a, b) => {
		return getHighestRating(b) - getHighestRating(a);
	});

	if (loading)
		return (
			<div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
				<div className="text-white/80">Loading players data...</div>
			</div>
		);

	if (error)
		return (
			<div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
				<div className="text-red-400">{error}</div>
			</div>
		);

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 sm:p-8">
			{/* Background Pattern */}
			<div className="fixed inset-0 opacity-30">
				<div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
			</div>

			<div className="relative z-10">
				<h2 className="text-3xl sm:text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 text-center">
					Hall of Fame
				</h2>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
					{sortedPlayers.map((player, index) => (
						<Link
							to={`/player/${player.chesscomUsername}`}
							key={player._id}
							className="group bg-white/10 backdrop-blur-md p-4 sm:p-6 rounded-xl border border-white/10 
                                hover:bg-white/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl
                                hover:shadow-blue-500/10"
						>
							{player.error ? (
								<div className="text-red-400">Failed to load player data</div>
							) : (
								<div className="space-y-4">
									<div className="flex items-center gap-4">
										<div
											className="font-bold text-2xl w-8 h-8 flex items-center justify-center
                                            rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white
                                            group-hover:from-blue-600 group-hover:to-purple-700 transition-colors"
										>
											#{index + 1}
										</div>
										{player.profile?.avatar ? (
											<img
												src={player.profile.avatar}
												alt="Player avatar"
												className="w-16 h-16 rounded-full ring-2 ring-white/20 group-hover:ring-white/40 transition-all"
											/>
										) : (
											<div
												className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 
                                                flex items-center justify-center text-2xl text-white/80"
											>
												{player.chesscomUsername[0].toUpperCase()}
											</div>
										)}
										<div>
											<h3 className="font-bold text-white group-hover:text-blue-400 transition-colors">
												{player.chesscomUsername}
											</h3>
											<p className="text-sm text-white/60">
												{player.profile?.name || "Anonymous"}
											</p>
										</div>
									</div>

									<div className="grid grid-cols-3 gap-4 p-3 bg-white/5 rounded-lg">
										{["Rapid", "Blitz", "Bullet"].map((type) => (
											<div key={type} className="text-center">
												<p className="text-xs text-white/60 mb-1">{type}</p>
												<p className="font-semibold text-white">
													{player.stats?.[`chess_${type.toLowerCase()}`]?.last?.rating ||
														"N/A"}
												</p>
											</div>
										))}
									</div>
								</div>
							)}
						</Link>
					))}
				</div>
			</div>
		</div>
	);
};

export default HallOfFame;
