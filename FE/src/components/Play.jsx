import { useState, useEffect } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import confetti from "canvas-confetti"; // Add this package: npm install canvas-confetti

const Play = () => {
	// Initialize state from localStorage or defaults
	const [game, setGame] = useState(() => {
		const savedGame = localStorage.getItem("chessGame");
		return savedGame ? new Chess(savedGame) : new Chess();
	});

	const [moveHistory, setMoveHistory] = useState(() => {
		const savedHistory = localStorage.getItem("moveHistory");
		return savedHistory ? JSON.parse(savedHistory) : [];
	});

	const [moveFrom, setMoveFrom] = useState("");
	const [rightClickedSquares, setRightClickedSquares] = useState({});
	const [moveSquares, setMoveSquares] = useState({});
	const [optionSquares, setOptionSquares] = useState({});
	const [gameOver, setGameOver] = useState(false);
	const [gameStatus, setGameStatus] = useState(null);

	// Save game state to localStorage whenever it changes
	useEffect(() => {
		localStorage.setItem("chessGame", game.fen());
		localStorage.setItem("moveHistory", JSON.stringify(moveHistory));
	}, [game, moveHistory]);

	// Add function to handle undo
	const handleUndo = () => {
		if (moveHistory.length === 0) return;

		const gameCopy = new Chess();
		// Replay all moves except the last one
		moveHistory.slice(0, -1).forEach((move) => {
			gameCopy.move({
				from: move.from,
				to: move.to,
				promotion: "q",
			});
		});

		setGame(gameCopy);
		setMoveFrom("");
		setOptionSquares({});
		setMoveSquares({});
		setMoveHistory((prev) => prev.slice(0, -1));
	};

	// Modify the reset function to include confirmation
	const handleReset = () => {
		if (window.confirm("Are you sure you want to reset the game?")) {
			const newGame = new Chess();
			setGame(newGame);
			setMoveFrom("");
			setOptionSquares({});
			setMoveSquares({});
			setMoveHistory([]);
			localStorage.removeItem("chessGame");
			localStorage.removeItem("moveHistory");
			setGameOver(false);
			setGameStatus(null);
		}
	};

	function getMoveOptions(square) {
		const moves = game.moves({
			square,
			verbose: true,
		});
		if (moves.length === 0) {
			setOptionSquares({});
			return false;
		}

		const newSquares = {};
		moves.map((move) => {
			newSquares[move.to] = {
				background:
					game.get(move.to) && game.get(move.to).color !== game.get(square).color
						? "radial-gradient(circle, rgba(255,0,0,.1) 85%, transparent 85%)"
						: "radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)",
				borderRadius: "50%",
			};
			return move;
		});
		newSquares[square] = {
			background: "rgba(255, 255, 0, 0.4)",
		};
		setOptionSquares(newSquares);
		return true;
	}

	function onSquareClick(square) {
		setRightClickedSquares({});

		// Check if clicking the same square or empty square when no piece is selected
		if (moveFrom === square) {
			// Deselect the piece
			setMoveFrom("");
			setOptionSquares({});
			return;
		}

		// If no piece is selected, check if the clicked square has a piece
		if (!moveFrom) {
			const piece = game.get(square);
			if (!piece || piece.color !== game.turn()) {
				setOptionSquares({});
				return;
			}
			const hasMoves = getMoveOptions(square);
			if (hasMoves) setMoveFrom(square);
			return;
		}

		// Trying to make a move
		const gameCopy = new Chess(game.fen());
		const move = gameCopy.move({
			from: moveFrom,
			to: square,
			promotion: "q",
		});

		// If invalid move
		if (move === null) {
			// Check if clicking another piece of the same color
			const piece = game.get(square);
			if (piece && piece.color === game.turn()) {
				const hasMoves = getMoveOptions(square);
				if (hasMoves) setMoveFrom(square);
			}
			return;
		}

		// Valid move
		setGame(gameCopy);
		setMoveFrom("");
		setOptionSquares({});
		setMoveSquares({
			[moveFrom]: { backgroundColor: "rgba(255, 255, 0, 0.4)" },
			[square]: { backgroundColor: "rgba(255, 255, 0, 0.4)" },
		});

		// Add move to history
		const newMove = {
			from: moveFrom,
			to: square,
			piece: game.get(moveFrom).type,
			color: game.get(moveFrom).color,
			moveNumber: Math.floor(game.moveNumber() / 2) + 1,
			notation: move.san,
		};
		setMoveHistory((prev) => [...prev, newMove]);

		// Check game status
		if (gameCopy.isGameOver()) {
			let status = "";
			if (gameCopy.isCheckmate()) {
				status = `Checkmate! ${game.turn() === "w" ? "Black" : "White"} wins!`;
				fireConfetti();
			} else if (gameCopy.isDraw()) status = "Game Over - It's a Draw!";
			else if (gameCopy.isStalemate()) status = "Game Over - Stalemate!";

			setGameStatus(status);
			setGameOver(true);
		}
	}

	function onSquareRightClick(square) {
		const colour = "rgba(0, 0, 255, 0.4)";
		setRightClickedSquares({
			...rightClickedSquares,
			[square]:
				rightClickedSquares[square] && rightClickedSquares[square].backgroundColor === colour
					? undefined
					: { backgroundColor: colour },
		});
	}

	// Add confetti animation function
	const fireConfetti = () => {
		const duration = 3000;
		const animationEnd = Date.now() + duration;

		const randomInRange = (min, max) => Math.random() * (max - min) + min;

		const interval = setInterval(() => {
			const timeLeft = animationEnd - Date.now();

			if (timeLeft <= 0) {
				return clearInterval(interval);
			}

			const particleCount = 50;
			confetti({
				particleCount,
				spread: 80,
				origin: { y: 0.6 },
				colors: ["#FFD700", "#FFA500", "#FF4500"],
				angle: randomInRange(55, 125),
			});
			confetti({
				particleCount,
				spread: 80,
				origin: { y: 0.6 },
				colors: ["#87CEEB", "#4169E1", "#0000FF"],
				angle: randomInRange(55, 125),
			});
		}, 250);
	};

	return (
		<div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4 gap-4">
			<div className="w-full max-w-[600px]">
				<div className="mb-4 text-center space-y-3">
					<h2 className="text-2xl font-bold text-white mb-2">
						{game.turn() === "w" ? "White's Turn" : "Black's Turn"}
					</h2>
					<div className="flex justify-center gap-3">
						<button
							className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
							onClick={handleReset}
						>
							Reset Game
						</button>
						<button
							className={`bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded ${
								moveHistory.length === 0 ? "opacity-50 cursor-not-allowed" : ""
							}`}
							onClick={handleUndo}
							disabled={moveHistory.length === 0}
						>
							Undo Move
						</button>
					</div>
				</div>
				{/* Add Game Over Modal */}
				{gameOver && (
					<div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
						<div className="bg-white/10 backdrop-blur-md p-8 rounded-xl text-center text-white border border-white/20 shadow-xl transform animate-fadeIn">
							<h2 className="text-3xl font-bold mb-4 animate-bounce">{gameStatus}</h2>
							<div className="space-y-4">
								<button
									onClick={handleReset}
									className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full transition-all duration-300 transform hover:scale-105"
								>
									Play Again
								</button>
							</div>
						</div>
					</div>
				)}
				<div className="w-full aspect-square">
					<Chessboard
						id="PlayVsPlay"
						animationDuration={200}
						position={game.fen()}
						onSquareClick={onSquareClick}
						onSquareRightClick={onSquareRightClick}
						boardOrientation="white" // Fixed orientation
						customBoardStyle={{
							borderRadius: "4px",
							boxShadow: "0 5px 15px rgba(0, 0, 0, 0.5)",
						}}
						customSquareStyles={{
							...moveSquares,
							...optionSquares,
							...rightClickedSquares,
						}}
						showBoardNotation={true}
						arePiecesDraggable={false}
					/>
				</div>
			</div>

			{/* Move History Panel */}
			<div className="w-full md:w-64 bg-gray-800/50 backdrop-blur-sm p-4 rounded-lg">
				<h3 className="text-xl font-bold text-white mb-3">Move History</h3>
				<div className="h-[400px] overflow-y-auto">
					<table className="w-full text-white/90">
						<tbody>
							{moveHistory.map((move, index) => (
								<tr key={index} className="hover:bg-white/5">
									<td className="py-1 px-2 text-gray-400">
										{move.color === "w" ? `${move.moveNumber}.` : ""}
									</td>
									<td className="py-1 px-2">{move.notation}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};

export default Play;
