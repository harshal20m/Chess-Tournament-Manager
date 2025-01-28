import React from "react";

function Videos() {
	const videos = [
		{
			id: 1,
			url: "https://youtu.be/dksvHyyI_Vo",
			thumbnail: "https://img.youtube.com/vi/dksvHyyI_Vo/maxresdefault.jpg",
			title: "The London System",
		},
		{
			id: 2,
			url: "https://youtu.be/5XyayUs6J1M",
			thumbnail: "https://img.youtube.com/vi/5XyayUs6J1M/maxresdefault.jpg",
			title: "The Kings Indian Defence",
		},
		{
			id: 3,
			url: "https://youtu.be/E4F77emUnqQ",
			thumbnail: "https://img.youtube.com/vi/E4F77emUnqQ/maxresdefault.jpg",
			title: "Tactics Must know",
		},
		{
			id: 4,
			url: "https://youtu.be/26174PF9Gmw",
			thumbnail: "https://img.youtube.com/vi/26174PF9Gmw/maxresdefault.jpg",
			title: "Middle Game?",
		},
	];

	return (
		<div className="container mx-auto p-4">
			<h2 className="text-3xl mt-5 font-bold text-center mb-8 text-white">Learnings</h2>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				{videos.map((video) => (
					<a
						key={video.id}
						href={video.url}
						target="_blank"
						rel="noopener noreferrer"
						className="block hover:transform hover:scale-105 transition-transform duration-300"
					>
						<div className="bg-white rounded-lg shadow-lg overflow-hidden">
							<img src={video.thumbnail} alt={video.title} className="w-full h-auto object-contain" />
							<div className="p-4">
								<h3 className="text-sm font-semibold text-gray-800">{video.title}</h3>
							</div>
						</div>
					</a>
				))}
			</div>
		</div>
	);
}

export default Videos;
