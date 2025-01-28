const Thoughts = () => {
	const thoughts = [
		{
			quote: "Chess is life in miniature. Chess is a struggle, chess is battles.",
			author: "Garry Kasparov",
			position: "World Chess Champion (1985-2000)",
		},
		{
			quote: "Chess is imagination. It's the ability to see patterns and create something new.",
			author: "Viswanathan Anand",
			position: "Indian Chess Grandmaster",
		},
		{
			quote: "Every chess master was once a beginner.",
			author: "Irving Chernev",
			position: "Chess Author and Master",
		},
		{
			quote: "Chess is not about being better than someone else, it's about being better than yourself.",
			author: "Magnus Carlsen",
			position: "Current World Chess Champion",
		},
		{
			quote: "It's important to get the pawns working together. They can be very strong when properly coordinated.",
			author: "Viswanathan Anand",
			position: "5-time World Chess Champion",
		},
	];

	return (
		<div className="container mx-auto p-6">
			<h2 className="text-3xl font-bold text-center mb-8 text-white">Chess Wisdom</h2>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{thoughts.map((thought, index) => (
					<div
						key={index}
						className="bg-white rounded-lg shadow-lg p-6 transform transition-transform duration-300 hover:scale-105"
					>
						<div className="flex flex-col h-full">
							<div className="flex-grow">
								<svg className="w-8 h-8 text-gray-400 mb-4" fill="currentColor" viewBox="0 0 24 24">
									<path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
								</svg>
								<p className="text-gray-700 text-lg italic mb-4">{thought.quote}</p>
							</div>
							<div className="border-t pt-4">
								<p className="font-semibold text-gray-900">{thought.author}</p>
								<p className="text-sm text-gray-600">{thought.position}</p>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default Thoughts;
