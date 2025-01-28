import Points from "./Points";

const PointsTable = () => {
	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900">
			{/* Background Pattern */}
			<div className="fixed inset-0 opacity-20">
				<div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
			</div>

			<div className="relative z-10 pb-4">
				<div className="max-w-7xl mx-auto pt-8 px-4 sm:px-6 lg:px-8">
					<h2 className="text-4xl font-bold text-center mb-2 text-white antialiased">Tournament Rankings</h2>
					<p className="text-gray-300 text-center mb-8 max-w-2xl mx-auto antialiased">
						Track the progress and achievements of our players throughout the tournament series.
					</p>

					<div className="bg-black/40 backdrop-blur-sm rounded-lg shadow-2xl border border-white/10 ">
						<Points />
					</div>
				</div>
			</div>
		</div>
	);
};

export default PointsTable;
