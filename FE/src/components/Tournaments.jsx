import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const Tournaments = () => {
	const [registrationCount, setRegistrationCount] = useState(0);
	const [isLoading, setIsLoading] = useState(true);

	// Tournament data
	const tournaments = [
		{
			id: "sunday-tournament",
			name: "Sunday Tournament",
			status: "open", // 'open', 'closed', 'ongoing'
			date: "02/feb/2025",
			time: "2:00 PM IST",
			format: "Open",
			timeControl: "10+0 Blitz",
			entryFee: "Free",
			prizePool: "Depends on registrations",
			maxParticipants: 32,
			details: [
				{ label: "Date", value: "02/feb/2025" },
				{ label: "Time", value: "2:00 PM IST" },
				{ label: "Format", value: "Open" },
				{ label: "Time Control", value: "10+0 Blitz" },
				{ label: "Entry Fee", value: "Free" },
				{ label: "Prize Pool", value: "Depends on registrations" },
			],
		},
		{
			id: "saturday-blitz",
			name: "Saturday Blitz",
			status: "upcoming",
			details: [
				{ label: "Date", value: "Every Saturday" },
				{ label: "Time", value: "4:00 PM IST" },
				{ label: "Format", value: "Swiss" },
				{ label: "Time Control", value: "5+0 Blitz" },
				{ label: "Entry Fee", value: "Free" },
				{ label: "Prize Pool", value: "₹500" },
			],
		},
	];

	// Fetch registration count
	useEffect(() => {
		const fetchRegistrationCount = async () => {
			try {
				const response = await fetch(
					"https://kuf4krkrb7.execute-api.ap-south-1.amazonaws.com/dev/api/register"
				);
				const data = await response.json();
				setRegistrationCount(data.length);
			} catch (err) {
				console.error("Error fetching registration count:", err);
			} finally {
				setIsLoading(false);
			}
		};

		fetchRegistrationCount();
		// Refresh count every minute
		const interval = setInterval(fetchRegistrationCount, 60000);
		return () => clearInterval(interval);
	}, []);

	const getStatusBadge = (status) => {
		const badges = {
			open: "bg-green-500 text-white",
			closed: "bg-red-500 text-white",
			upcoming: "bg-yellow-500 text-white",
			ongoing: "bg-blue-500 text-white",
		};
		const labels = {
			open: "Registrations Open",
			closed: "Registrations Closed",
			upcoming: "Coming Soon",
			ongoing: "Tournament Ongoing",
		};
		return {
			className: `text-xs px-2 py-1 rounded-full whitespace-nowrap ${badges[status]}`,
			label: labels[status],
		};
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 sm:p-8">
			{/* Background Pattern */}
			<div className="fixed inset-0 opacity-30 pointer-events-none">
				<div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
				<div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
				<div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
				<div className="absolute bottom-0 left-50 w-96 h-96 bg-pink-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
			</div>

			{/* Main Content */}
			<div className="max-w-6xl mx-auto relative z-10">
				<h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 text-center">
					Upcoming Tournaments
				</h2>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{tournaments.map((tournament) => (
						<div
							key={tournament.id}
							className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/10"
						>
							<div className="flex justify-between items-start mb-4">
								<h3 className="text-xl font-bold text-white">{tournament.name}</h3>
								<span className={getStatusBadge(tournament.status).className}>
									{getStatusBadge(tournament.status).label}
								</span>
							</div>

							<div className="space-y-3 text-white/80">
								{tournament.details.map((detail, index) => (
									<p key={index} className="flex justify-between">
										<span className="text-white/60">{detail.label}:</span>
										<span>{detail.value}</span>
									</p>
								))}
							</div>

							<div className="mt-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
								{tournament.status === "open" && (
									<Link
										to="/registration"
										className="w-full sm:w-auto bg-gradient-to-r from-blue-500/80 to-purple-600/80 
											text-white px-6 py-2 rounded-lg text-center hover:from-purple-600/80 
											hover:to-blue-500/80 transition-all duration-300 hover:scale-105 backdrop-blur-md"
									>
										Register Now
									</Link>
								)}
								{tournament.status === "open" && (
									<span className="text-white/60">
										{isLoading
											? "Loading..."
											: `${registrationCount} player${
													registrationCount !== 1 ? "s" : ""
											  } registered`}
									</span>
								)}
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default Tournaments;
