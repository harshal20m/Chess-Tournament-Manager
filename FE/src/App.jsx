import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Tournaments from "./components/Tournaments";
import PointsTable from "./components/PointsTable";
import Registration from "./components/Registration";
import HallOfFame from "./components/HallOfFame";
import Footer from "./components/Footer";
import Header from "./components/Header";
import PlayerDetails from "./components/PlayerDetails";
import Matchups from "./components/Matchups";
import AdminMatchControl from "./components/AdminMatchControl";
import Play from "./components/Play";

const App = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const checkBackendConnection = async () => {
			try {
				const response = await fetch("https://kuf4krkrb7.execute-api.ap-south-1.amazonaws.com/dev/api/health");
				if (!response.ok) {
					throw new Error("Backend service is not responding");
				}
				setIsLoading(false);
			} catch (err) {
				console.error("Backend connection error:", err);
				setError("Unable to connect to the server. Please try again later.");
				// Retry connection after 5 seconds
				setTimeout(checkBackendConnection, 5000);
			}
		};

		checkBackendConnection();
	}, []);

	if (isLoading || error) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
				<div className="bg-white/10 backdrop-blur-md rounded-xl p-8 max-w-md w-full mx-4 text-center border border-white/10">
					{error ? (
						<div className="text-red-400 space-y-4">
							<p className="text-lg font-semibold">{error}</p>
							<div className="text-white/60 text-sm">Attempting to reconnect...</div>
						</div>
					) : (
						<div className="space-y-6">
							<div className="flex flex-col items-center gap-4">
								<div className="w-16 h-16 border-4 border-blue-500/50 border-t-blue-500 rounded-full animate-spin"></div>
								<div className="text-white/80">
									<p className="text-xl font-semibold mb-2">Loading Chess MBH</p>
									<p className="text-sm text-white/60">Please wait while we set up the board...</p>
								</div>
							</div>
							<div className="flex justify-center items-center gap-2">
								<div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
								<div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-.3s]"></div>
								<div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-.5s]"></div>
							</div>
						</div>
					)}
				</div>
			</div>
		);
	}

	return (
		<Router>
			<div className="min-h-screen pt-14">
				<Header />
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/tournaments" element={<Tournaments />} />
					<Route path="/points-table" element={<PointsTable />} />
					<Route path="/registration" element={<Registration />} />
					<Route path="/hall-of-fame" element={<HallOfFame />} />
					<Route path="/player/:username" element={<PlayerDetails />} />
					<Route path="/matchups" element={<Matchups />} />
					<Route path="/admin/matches" element={<AdminMatchControl />} />
					<Route path="/play" element={<Play />} />
				</Routes>
				<Footer />
			</div>
		</Router>
	);
};

export default App;
