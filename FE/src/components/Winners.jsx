import { FaMedal } from "react-icons/fa";

const Winners = () => {
	const winners = [
		{ name: "Vishesh", position: 1, seed: "vishesh" },
		{ name: "Mayank", position: 2, seed: "mayank" },
		{ name: "Siddharth", position: 3, seed: "siddharth" },
	];

	return (
		<div className="relative w-full max-w-2xl mx-auto mt-8 mb-12">
			<h2 className="text-2xl font-bold text-center  text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
				Tournament Winners <br /> Sunday
			</h2>

			<div className="flex justify-center items-end gap-4 h-[300px]">
				{/* Silver - Vishesh */}
				<div className="flex flex-col items-center">
					<p className="mt-2 font-semibold text-white">{winners[1].name}</p>
					<div className="relative">
						<FaMedal className="text-4xl text-gray-300 absolute bottom-8 left-1/2 transform -translate-x-1/2" />
					</div>
					<div className="h-32 w-24 bg-gradient-to-t from-gray-600 to-gray-400 mt-6 flex flex-col items-center justify-center">
						{" "}
						<p className=" font-bold text-white text-4xl">#2</p>
						<p className="text-white text-sm">(3 points)</p>
					</div>
				</div>

				{/* Gold - Siddharth */}
				<div className="flex flex-col items-center">
					<p className="mt-2 font-semibold text-white">{winners[0].name}</p>
					<div className="relative">
						<FaMedal className="text-5xl text-yellow-400 absolute bottom-8 left-1/2 transform -translate-x-1/2" />
					</div>
					<div className="h-40 w-24 bg-gradient-to-t from-yellow-600 to-yellow-400 mt-6 flex flex-col items-center justify-center">
						<p className=" font-bold text-white text-4xl">#1</p>
						<p className="text-white text-sm">(4 points)</p>
					</div>
				</div>

				{/* Bronze - Mayank */}
				<div className="flex flex-col items-center">
					<p className="mt-2 font-semibold text-white">{winners[2].name}</p>
					<div className="relative">
						<FaMedal className="text-3xl text-amber-700 absolute bottom-8 left-1/2 transform -translate-x-1/2" />
					</div>
					<div className="h-24 w-24 bg-gradient-to-t from-amber-700 to-amber-800 mt-6 flex flex-col items-center justify-center">
						{" "}
						<p className=" font-bold text-white text-4xl">#3</p>
						<p className="text-white text-sm">(3 points)</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Winners;
