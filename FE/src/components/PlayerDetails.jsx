import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { IoArrowBack, IoPlaySkipForward, IoPlaySkipBack, IoPlay, IoPause } from "react-icons/io5";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";

const PlayerDetails = () => {
	const { username } = useParams();
	const navigate = useNavigate();
	const [playerData, setPlayerData] = useState(null);
	const [recentGames, setRecentGames] = useState([]);
	const [loading, setLoading] = useState(true);
	const [selectedGame, setSelectedGame] = useState(null);
	const [game, setGame] = useState(null);
	const [currentMove, setCurrentMove] = useState(0);
	const [isPlaying, setIsPlaying] = useState(false);
	const [movesList, setMovesList] = useState([]);
	const [boardWidth, setBoardWidth] = useState(600);

	useEffect(() => {
		const fetchPlayerDetails = async () => {
			try {
				const [profile, stats, games] = await Promise.all([
					fetch(`https://api.chess.com/pub/player/${username}`),
					fetch(`https://api.chess.com/pub/player/${username}/stats`),
					fetch(`https://api.chess.com/pub/player/${username}/games/archives`),
				]);

				const profileData = await profile.json();
				const statsData = await stats.json();
				const gamesData = await games.json();

				// Fetch most recent games
				const lastMonth = gamesData.archives[gamesData.archives.length - 1];
				const recentGamesResponse = await fetch(lastMonth);
				const recentGamesData = await recentGamesResponse.json();

				setPlayerData({ profile: profileData, stats: statsData });
				setRecentGames(recentGamesData.games.slice(0, 10)); // Get last 10 games
			} catch (error) {
				console.error("Error fetching player details:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchPlayerDetails();
	}, [username]);

	useEffect(() => {
		const updateDimensions = () => {
			const width = window.innerWidth;
			if (width < 480) {
				setBoardWidth(280); // Extra small screens
			} else if (width < 768) {
				setBoardWidth(350); // Small screens
			} else if (width < 1024) {
				setBoardWidth(450); // Medium screens
			} else {
				setBoardWidth(600); // Large screens
			}
		};

		// Initial call
		updateDimensions();

		// Add event listener
		window.addEventListener("resize", updateDimensions);

		// Cleanup
		return () => window.removeEventListener("resize", updateDimensions);
	}, []);

	const parsePGN = (pgn) => {
		try {
			const chess = new Chess();

			// Extract moves by removing clock times and comments
			const cleanPGN = pgn
				.replace(/\{[^}]*\}/g, "") // Remove clock time comments
				.replace(/\[[^\]]*\]/g, "") // Remove header brackets
				.replace(/\d+\./g, "") // Remove move numbers
				.replace(/\s+/g, " ") // Normalize whitespace
				.trim();

			// Split into moves and clean them
			const movesArray = cleanPGN.split(/\s+/).filter((move) => move && !move.match(/^(1-0|0-1|1\/2-1\/2|\*)$/));

			chess.reset();
			const moves = [];
			moves.push({
				fen: chess.fen(),
				san: "Start",
				moveNumber: 0,
			});

			// Apply each move and store positions
			for (let i = 0; i < movesArray.length; i++) {
				try {
					const move = chess.move(movesArray[i], { sloppy: true });
					if (move) {
						moves.push({
							fen: chess.fen(),
							san: move.san,
							from: move.from,
							to: move.to,
							moveNumber: i + 1,
						});
					}
				} catch (moveError) {
					console.error("Invalid move:", movesArray[i], moveError);
				}
			}

			return moves;
		} catch (error) {
			console.error("Error parsing PGN:", error);
			return [];
		}
	};

	const handleGameSelect = (game) => {
		try {
			setSelectedGame(game);

			if (!game.pgn) {
				throw new Error("No PGN found in game");
			}

			console.log("Processing game:", {
				white: game.white.username,
				black: game.black.username,
				result: `${game.white.result}-${game.black.result}`,
			});

			const moves = parsePGN(game.pgn);
			console.log("Parsed moves count:", moves.length);

			if (moves.length > 0) {
				setMovesList(moves);
				setCurrentMove(0);
				setGame(new Chess());
				setIsPlaying(false);
			} else {
				throw new Error("No moves parsed from PGN");
			}
		} catch (error) {
			console.error("Error selecting game:", error);
			alert("Unable to load game. Please try another one.");
		}
	};

	// Add debug logging for moves list changes
	useEffect(() => {
		console.log("Current movesList:", movesList);
		console.log("Current move:", currentMove);
	}, [movesList, currentMove]);

	// Auto-play functionality
	useEffect(() => {
		let interval;
		if (isPlaying && currentMove < movesList.length - 1) {
			interval = setInterval(() => {
				setCurrentMove((prev) => prev + 1);
			}, 1000);
		}
		return () => clearInterval(interval);
	}, [isPlaying, currentMove, movesList]);

	// Game controls
	const handleNext = () => {
		if (currentMove < movesList.length - 1) {
			setCurrentMove((prev) => prev + 1);
		}
	};

	const handlePrevious = () => {
		if (currentMove > 0) {
			setCurrentMove((prev) => prev - 1);
		}
	};

	const togglePlay = () => {
		setIsPlaying(!isPlaying);
	};

	const handleReset = () => {
		setCurrentMove(0);
		setIsPlaying(false);
	};

	// Updated result style function with more cases
	const getGameResultStyle = (game) => {
		const isPlayerWhite = game.white.username.toLowerCase() === username.toLowerCase();
		const result = isPlayerWhite ? game.white.result : game.black.result;

		switch (result) {
			case "win":
				return "text-green-400";
			case "checkmated":
			case "lose":
			case "resigned":
			case "timeout":
			case "abandoned":
				return "text-red-400";
			case "drew":
			case "stalemate":
			case "repetition":
			case "insufficient":
			case "agreed":
			case "timevsinsufficient":
				return "text-yellow-400";
			default:
				return "text-white/60";
		}
	};

	// Updated result text formatter with more detailed outcomes
	const formatGameResult = (game) => {
		const isPlayerWhite = game.white.username.toLowerCase() === username.toLowerCase();
		const playerResult = isPlayerWhite ? game.white.result : game.black.result;
		const opponentResult = isPlayerWhite ? game.black.result : game.white.result;

		// Map result types to human-readable messages
		const resultMessages = {
			win: "Victory",
			lose: "Defeat",
			timeout: "Lost on time",
			resigned: "Resigned",
			checkmated: "Checkmated",
			abandoned: "Abandoned",
			drew: "Draw",
			stalemate: "Stalemate",
			repetition: "Draw by repetition",
			insufficient: "Insufficient material",
			agreed: "Draw agreed",
			timevsinsufficient: "Draw (time vs insufficient material)",
		};

		// Handle special cases where we want to show how the game ended
		if (playerResult in resultMessages) {
			return resultMessages[playerResult];
		}

		// For cases where the result is not in our mapping
		if (opponentResult === "resigned") return "Won by resignation";
		if (opponentResult === "timeout") return "Won on time";
		if (opponentResult === "abandoned") return "Won by abandonment";

		// Default fallback
		return `${game.white.result}-${game.black.result}`;
	};

	if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-2 sm:p-6">
			{/* Enhanced Header */}
			<div className="bg-white/10 backdrop-blur-md rounded-xl p-4 sm:p-6 mb-6 flex flex-col sm:flex-row items-center gap-4 shadow-lg border border-white/10">
				<button
					onClick={() => navigate("/hall-of-fame")}
					className="absolute left-4 top-4 text-white/70 hover:text-white transition-colors"
				>
					<IoArrowBack size={24} />
				</button>

				<div className="flex flex-col items-center sm:flex-row sm:items-center gap-4 w-full">
					{playerData?.profile?.avatar ? (
						<img
							src={playerData.profile.avatar}
							alt={username}
							className="w-24 h-24 sm:w-32 sm:h-32 rounded-full ring-4 ring-white/20"
						/>
					) : (
						<div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-4xl">
							{username[0].toUpperCase()}
						</div>
					)}
					<div className="text-center sm:text-left">
						<h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
							{username}
						</h1>
						<p className="text-white/60">{playerData?.profile?.name || "Anonymous"}</p>
					</div>
				</div>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
				{["rapid", "blitz", "bullet"].map((type) => (
					<div
						key={type}
						className="bg-white/10 backdrop-blur-md rounded-xl p-4 text-center transform hover:scale-105 transition-transform duration-300 border border-white/10"
					>
						<h3 className="text-lg font-semibold capitalize text-white/80">{type}</h3>
						<p className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
							{playerData?.stats?.[`chess_${type}`]?.last?.rating || "N/A"}
						</p>
					</div>
				))}
			</div>

			{/* Game Viewer Section */}
			<div className="bg-white/10 backdrop-blur-md rounded-xl p-2 sm:p-6">
				<h2 className="text-xl sm:text-2xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
					Recent Games
				</h2>
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
					{/* Chess Board Container */}
					<div className="bg-gray-800/50 rounded-xl p-2 sm:p-4 space-y-4">
						{selectedGame && movesList.length > 0 ? (
							<>
								<div className="w-full flex justify-center items-center">
									<div className="w-full max-w-[600px]">
										<Chessboard
											position={movesList[currentMove]?.fen || "start"}
											boardWidth={boardWidth}
											customDarkSquareStyle={{ backgroundColor: "#1e293b" }}
											customLightSquareStyle={{ backgroundColor: "#334155" }}
											animationDuration={200}
										/>
									</div>
								</div>

								{/* Game Controls with gradients */}
								<div className="flex justify-center items-center gap-2 sm:gap-4">
									<button
										onClick={handleReset}
										className="p-1 sm:p-2 rounded-full hover:bg-gray-700/50"
									>
										<IoPlaySkipBack size={window.innerWidth < 640 ? 20 : 24} />
									</button>
									<button
										onClick={handlePrevious}
										className="p-1 sm:p-2 rounded-full hover:bg-gray-700/50 disabled:opacity-50"
										disabled={currentMove === 0}
									>
										<IoPlaySkipBack size={window.innerWidth < 640 ? 20 : 24} />
									</button>
									<button
										onClick={togglePlay}
										className="p-1 sm:p-2 rounded-full hover:bg-gray-700/50"
									>
										{isPlaying ? (
											<IoPause size={window.innerWidth < 640 ? 20 : 24} />
										) : (
											<IoPlay size={window.innerWidth < 640 ? 20 : 24} />
										)}
									</button>
									<button
										onClick={handleNext}
										className="p-1 sm:p-2 rounded-full hover:bg-gray-700/50 disabled:opacity-50"
										disabled={currentMove === movesList.length - 1}
									>
										<IoPlaySkipForward size={window.innerWidth < 640 ? 20 : 24} />
									</button>
								</div>

								{/* Moves List with better styling */}
								<div className="mt-2 sm:mt-4 h-24 sm:h-32 overflow-y-auto bg-gray-900/50 rounded-xl p-2">
									<div className="grid grid-cols-2 gap-1 sm:gap-2 text-xs sm:text-sm">
										{movesList.slice(1).map((move, idx) => (
											<div
												key={idx}
												onClick={() => setCurrentMove(idx + 1)}
												className={`p-2 rounded-lg cursor-pointer transition-colors
													${idx + 1 === currentMove ? "bg-blue-500/20 text-blue-300" : "hover:bg-white/5"}`}
											>
												<span className="text-white/40 mr-2">
													{idx % 2 === 0 ? `${Math.ceil((idx + 1) / 2)}.` : ""}
												</span>
												{move.san}
											</div>
										))}
									</div>
								</div>
							</>
						) : (
							<div className="flex items-center justify-center h-64">
								<p className="text-white/60">Select a game to view</p>
							</div>
						)}
					</div>

					{/* Games List with enhanced styling and result colors */}
					<div className="space-y-2 sm:space-y-3 h-[400px] sm:h-[600px] overflow-y-auto pr-2 custom-scrollbar">
						{recentGames.map((game, index) => {
							const resultStyle = getGameResultStyle(game);
							const resultText = formatGameResult(game);
							const isPlayerWhite = game.white.username.toLowerCase() === username.toLowerCase();

							return (
								<div
									key={index}
									onClick={() => handleGameSelect(game)}
									className={`p-2 sm:p-4 rounded-xl cursor-pointer transition-all duration-300 text-sm sm:text-base
										${
											selectedGame === game
												? "bg-blue-500/20 border border-blue-500/50"
												: "bg-gray-800/50 hover:bg-gray-700/50 border border-transparent"
										}`}
								>
									<div className="flex justify-between items-center mb-2">
										<div className="flex flex-col">
											<p className="font-semibold flex items-center gap-2">
												<span className={isPlayerWhite ? "text-white" : "text-white/60"}>
													{game.white.username}
												</span>
												<span className="text-white/40">vs</span>
												<span className={!isPlayerWhite ? "text-white" : "text-white/60"}>
													{game.black.username}
												</span>
											</p>
											<span className="text-xs text-white/60">
												{new Date(game.end_time * 1000).toLocaleDateString()}
											</span>
										</div>
										<span className={`text-sm font-medium ${resultStyle}`}>{resultText}</span>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
};

export default PlayerDetails;
