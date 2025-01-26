import React from "react";

const Points = () => {
	const players = [
		{ rank: 1, name: "Magnus Carlsen", points: 8.5, wins: 8, draws: 1, losses: 1 },
		{ rank: 2, name: "Hikaru Nakamura", points: 8.0, wins: 7, draws: 2, losses: 1 },
		{ rank: 3, name: "Alireza Firouzja", points: 7.5, wins: 7, draws: 1, losses: 2 },
		{ rank: 4, name: "Ding Liren", points: 7.0, wins: 6, draws: 2, losses: 2 },
		{ rank: 5, name: "Ian Nepomniachtchi", points: 6.5, wins: 6, draws: 1, losses: 3 },
		{ rank: 6, name: "Fabiano Caruana", points: 6.0, wins: 5, draws: 2, losses: 3 },
		{ rank: 7, name: "Wesley So", points: 5.5, wins: 5, draws: 1, losses: 4 },
		{ rank: 8, name: "Anish Giri", points: 5.0, wins: 4, draws: 2, losses: 4 },
		{ rank: 9, name: "Viswanathan Anand", points: 4.5, wins: 4, draws: 1, losses: 5 },
		{ rank: 10, name: "Maxime Vachier-Lagrave", points: 4.0, wins: 3, draws: 2, losses: 5 },
	];

	return (
		<div className="w-full overflow-x-auto">
			<table className="min-w-full bg-gray-800 text-white">
				<thead>
					<tr className="bg-gray-700">
						<th className="px-4 py-2">Rank</th>
						<th className="px-4 py-2">Player</th>
						<th className="px-4 py-2">Points</th>
						<th className="px-4 py-2">W</th>
						<th className="px-4 py-2">D</th>
						<th className="px-4 py-2">L</th>
					</tr>
				</thead>
				<tbody>
					{players.map((player) => (
						<tr key={player.rank} className="border-b border-gray-700 hover:bg-gray-600">
							<td className="px-4 py-2 text-center">{player.rank}</td>
							<td className="px-4 py-2">{player.name}</td>
							<td className="px-4 py-2 text-center">{player.points}</td>
							<td className="px-4 py-2 text-center">{player.wins}</td>
							<td className="px-4 py-2 text-center">{player.draws}</td>
							<td className="px-4 py-2 text-center">{player.losses}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default Points;
