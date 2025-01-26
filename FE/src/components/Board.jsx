import { useState, useEffect, useRef } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";

const Board = () => {
	const containerRef = useRef(null);
	const [boardWidth, setBoardWidth] = useState(400);
	const [username, setUsername] = useState("");
	const [game, setGame] = useState(new Chess());
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [currentMove, setCurrentMove] = useState(0);
	const [moves, setMoves] = useState([]);

	useEffect(() => {
		const updateDimensions = () => {
			if (containerRef.current) {
				const containerWidth = containerRef.current.offsetWidth;
				const newBoardWidth = Math.min(
					containerWidth - 32, // Account for padding
					600 // Maximum board width
				);
				setBoardWidth(newBoardWidth);
			}
		};

		updateDimensions();
		window.addEventListener("resize", updateDimensions);
		return () => window.removeEventListener("resize", updateDimensions);
	}, []);

	const fetchLatestGame = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			// Get the current month's games
			const currentDate = new Date();
			const year = currentDate.getFullYear();
			const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");

			const gamesResponse = await fetch(`https://api.chess.com/pub/player/${username}/games/${year}/${month}`);

			if (!gamesResponse.ok) {
				throw new Error("Failed to fetch games");
			}

			const gamesData = await gamesResponse.json();

			// Get the latest game
			const latestGame = gamesData.games[gamesData.games.length - 1];

			if (!latestGame) {
				throw new Error("No games found for this month");
			}

			// Create new chess instance and load the PGN
			const newGame = new Chess();
			newGame.loadPgn(latestGame.pgn);

			setGame(newGame);
			setMoves(newGame.history());
			setCurrentMove(0);
		} catch (err) {
			setError("Failed to fetch game data. Please check the username and try again.");
		} finally {
			setLoading(false);
		}
	};

	const navigateMove = (moveIndex) => {
		const newGame = new Chess();
		const moveHistory = moves.slice(0, moveIndex + 1);
		moveHistory.forEach((move) => newGame.move(move));
		setGame(newGame);
		setCurrentMove(moveIndex);
	};

	return (
		<div className="bg-white/80 rounded-xl shadow-lg p-3 sm:p-6 md:p-8" ref={containerRef}>
			<h2 className="text-xl sm:text-2xl font-bold mb-4 text-center">Latest Chess Game</h2>

			<form onSubmit={fetchLatestGame} className="mb-4 sm:mb-6">
				<div className="flex flex-col sm:flex-row gap-2">
					<input
						type="text"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						placeholder="Enter Chess.com username"
						className="w-full px-3 py-2 text-sm sm:text-base rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
					<button
						type="submit"
						disabled={loading}
						className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
					>
						{loading ? "Loading..." : "Show Latest Game"}
					</button>
				</div>
			</form>

			{error && <div className="text-red-500 mb-4 text-sm sm:text-base text-center">{error}</div>}

			<div className="flex justify-center items-center">
				<div style={{ width: boardWidth, maxWidth: "100%" }}>
					<Chessboard
						position={game.fen()}
						boardWidth={boardWidth}
						animationDuration={200}
						customBoardStyle={{
							borderRadius: "4px",
							boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
						}}
					/>
				</div>
			</div>

			{moves.length > 0 && (
				<div className="mt-4 sm:mt-6">
					<div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 mb-2 sm:mb-4">
						<div className="flex gap-2">
							<button
								onClick={() => navigateMove(0)}
								disabled={currentMove === 0}
								className="px-3 py-1.5 text-sm bg-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-300 transition-colors"
							>
								⟪
							</button>
							<button
								onClick={() => navigateMove(Math.max(currentMove - 1, 0))}
								disabled={currentMove === 0}
								className="px-3 py-1.5 text-sm bg-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-300 transition-colors"
							>
								←
							</button>
						</div>
						<div className="text-sm sm:text-base font-medium px-4">
							{currentMove + 1} / {moves.length}
						</div>
						<div className="flex gap-2">
							<button
								onClick={() => navigateMove(Math.min(currentMove + 1, moves.length - 1))}
								disabled={currentMove === moves.length - 1}
								className="px-3 py-1.5 text-sm bg-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-300 transition-colors"
							>
								→
							</button>
							<button
								onClick={() => navigateMove(moves.length - 1)}
								disabled={currentMove === moves.length - 1}
								className="px-3 py-1.5 text-sm bg-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-300 transition-colors"
							>
								⟫
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Board;
