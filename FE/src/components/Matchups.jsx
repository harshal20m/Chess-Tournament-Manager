import React from "react";

const Matchups = () => {
	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 sm:p-8">
			{/* Background Pattern */}
			<div className="fixed inset-0 opacity-30 pointer-events-none">
				<div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
				<div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
				<div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
				<div className="absolute bottom-0 left-50 w-96 h-96 bg-pink-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
			</div>

			{/* Content */}
			<div className="relative z-10 max-w-4xl mx-auto text-center">
				<h2 className="text-3xl sm:text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
					Tournament Matchups
				</h2>

				<div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/10">
					<div className="flex flex-col items-center justify-center space-y-4">
						<div className="w-16 h-16 border-4 border-blue-500/50 border-t-blue-500 rounded-full animate-spin"></div>
						<p className="text-white/80 text-lg sm:text-xl">Matchups will be announced soon</p>
						<p className="text-white/60">Check back after registration closes</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Matchups;
