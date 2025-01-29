import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Chat from "./Chat";
import LoginModal from "./LoginModal";
import { IoChatboxEllipses } from "react-icons/io5";
import { GiChessKnight } from "react-icons/gi";

import Thoughts from "./Thoughts";
import Videos from "./Videos";

const Home = () => {
	const [isChatOpen, setIsChatOpen] = useState(false);
	const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
	const [currentUser, setCurrentUser] = useState(() => {
		try {
			// Check if user data exists in localStorage
			const savedUser = localStorage.getItem("user");
			return savedUser ? JSON.parse(savedUser) : null;
		} catch (error) {
			// If there's any error parsing, remove the invalid data and return null
			localStorage.removeItem("user");
			return null;
		}
	});

	const handleChatClick = () => {
		if (!currentUser) {
			setIsLoginModalOpen(true);
		} else {
			setIsChatOpen(true);
		}
	};

	const handleLogin = (user, pass) => {
		if (!user) return;
		const userData = {
			username: user,
			password: pass,
			loginTime: new Date().toISOString(),
		};
		setCurrentUser(userData.username);
		// Store without JSON.stringify
		localStorage.setItem("username", userData.username);
		localStorage.setItem("password", userData.password);
		setIsLoginModalOpen(false);
		setIsChatOpen(true);
	};

	const handleLogout = () => {
		setIsChatOpen(false);
		setCurrentUser(null);
		// Don't remove from localStorage on logout
		// localStorage.removeItem("user");
	};

	// Add logout button if user is logged in
	const renderUserControls = () => {
		if (currentUser) {
			return (
				<div className="fixed bottom-18 sm:bottom-22 right-4 sm:right-6 flex flex-col gap-2">
					<span className="bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-sm">
						{currentUser}
					</span>
					<button
						onClick={handleLogout}
						className="bg-red-500/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-sm hover:bg-red-500/30"
					>
						Logout
					</button>
				</div>
			);
		}
		return null;
	};

	// Add effect to rehydrate user on page refresh
	useEffect(() => {
		const savedUser = localStorage.getItem("user");
		if (savedUser) {
			try {
				const parsedUser = JSON.parse(savedUser);
				if (parsedUser) {
					setCurrentUser(parsedUser);
				}
			} catch (error) {
				console.error("Error parsing user data:", error);
			}
		}
	}, []);

	return (
		<div className="relative min-h-screen overflow-hidden">
			{/* Modern Gradient Background with Pattern */}
			<div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
				{/* Animated patterns */}
				<div className="absolute inset-0 opacity-20">
					<div className="absolute h-[40rem] w-[40rem] rounded-full bg-gradient-to-r from-blue-400 to-purple-500 mix-blend-multiply blur-3xl animate-blob top-0 -left-20"></div>
					<div className="absolute h-[35rem] w-[35rem] rounded-full bg-gradient-to-r from-purple-400 to-pink-500 mix-blend-multiply blur-3xl animate-blob animation-delay-2000 top-40 -right-20"></div>
					<div className="absolute h-[30rem] w-[30rem] rounded-full bg-gradient-to-r from-pink-400 to-orange-500 mix-blend-multiply blur-3xl animate-blob animation-delay-4000 bottom-0 left-1/2"></div>
				</div>

				{/* Grid Pattern Overlay */}
				<div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
			</div>

			{/* Content */}
			<div className="relative z-10 p-4">
				<div className="text-3xl sm:text-4xl md:text-6xl font-bold text-center text-white mb-4 sm:mb-8 mt-2 sm:mt-4 flex align-center justify-center">
					<GiChessKnight size={40} color="white" /> &nbsp; Chess MBH &nbsp;
					<GiChessKnight size={40} color="white" />
				</div>

				{/* Navigation Cards */}
				<div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-3 sm:gap-6 justify-center pt-6 sm:pt-12 px-2 max-w-6xl mx-auto">
					<Link
						to="/tournaments"
						className="group h-16 sm:h-20 w-full sm:w-44 text-base sm:text-xl text-center flex flex-col justify-center items-center rounded-xl sm:rounded-2xl 
                    bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 text-white 
                    shadow-[0_0_10px_rgba(66,153,225,0.3)] sm:shadow-[0_0_20px_rgba(66,153,225,0.5)]
                    hover:shadow-[0_0_15px_rgba(99,102,241,0.4)] sm:hover:shadow-[0_0_25px_rgba(99,102,241,0.6)]
                    transition-all duration-300 hover:scale-[1.02] sm:hover:scale-105 
                    hover:from-blue-600 hover:via-blue-700 hover:to-purple-700
                    relative overflow-hidden"
					>
						<span className="relative z-10">Tournaments</span>
						<div
							className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent 
                        translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"
						></div>
					</Link>

					<Link
						to="/points-table"
						className="group h-16 sm:h-20 w-full sm:w-44 text-base sm:text-xl text-center flex flex-col justify-center items-center rounded-xl sm:rounded-2xl 
                    bg-gradient-to-br from-green-500 via-green-600 to-teal-600 text-white 
                    shadow-[0_0_10px_rgba(72,187,120,0.3)] sm:shadow-[0_0_20px_rgba(72,187,120,0.5)]
                    hover:shadow-[0_0_15px_rgba(56,178,172,0.4)] sm:hover:shadow-[0_0_25px_rgba(56,178,172,0.6)]
                    transition-all duration-300 hover:scale-[1.02] sm:hover:scale-105 
                    hover:from-green-600 hover:via-green-700 hover:to-teal-700
                    relative overflow-hidden"
					>
						<span className="relative z-10">Points Table</span>
						<div
							className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent 
                        translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"
						></div>
					</Link>

					<Link
						to="/registration"
						className="group h-16 sm:h-20 w-full sm:w-44 text-base sm:text-xl text-center flex flex-col justify-center items-center rounded-xl sm:rounded-2xl 
             bg-gradient-to-br from-blue-500 via-purple-600 to-green-600 text-white 
             shadow-[0_0_10px_rgba(59,130,246,0.3)] sm:shadow-[0_0_20px_rgba(59,130,246,0.5)]
             hover:shadow-[0_0_15px_rgba(34,197,94,0.4)] sm:hover:shadow-[0_0_25px_rgba(34,197,94,0.6)]
             transition-all duration-300 hover:scale-[1.02] sm:hover:scale-105 
             hover:from-blue-600 hover:via-purple-700 hover:to-green-700
             relative overflow-hidden"
					>
						<span className="relative z-10">Registration</span>
						<div
							className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent 
                        translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"
						></div>
					</Link>
					<Link
						to="/matchups"
						className="group h-16 sm:h-20 w-full sm:w-44 text-base sm:text-xl text-center flex flex-col justify-center items-center rounded-xl sm:rounded-2xl 
                    bg-gradient-to-br from-orange-500 via-orange-600 to-pink-600 text-white 
                    shadow-[0_0_10px_rgba(237,137,54,0.3)] sm:shadow-[0_0_20px_rgba(237,137,54,0.5)]
                    hover:shadow-[0_0_15px_rgba(236,72,153,0.4)] sm:hover:shadow-[0_0_25px_rgba(236,72,153,0.6)]
                    transition-all duration-300 hover:scale-[1.02] sm:hover:scale-105 
                    hover:from-orange-600 hover:via-orange-700 hover:to-pink-700
                    relative overflow-hidden"
					>
						<span className="relative z-10">Matchups</span>
						<div
							className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent 
                        translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"
						></div>
					</Link>

					<Link
						to="/hall-of-fame"
						className="group h-16 sm:h-20 w-full sm:w-44 text-base sm:text-xl text-center flex flex-col justify-center items-center rounded-xl sm:rounded-2xl 
             bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 text-white 
             shadow-[0_0_10px_rgba(252,211,77,0.3)] sm:shadow-[0_0_20px_rgba(252,211,77,0.5)]
             hover:shadow-[0_0_15px_rgba(252,211,77,0.4)] sm:hover:shadow-[0_0_25px_rgba(252,211,77,0.6)]
             transition-all duration-300 hover:scale-[1.02] sm:hover:scale-105 
             hover:from-yellow-500 hover:via-yellow-600 hover:to-yellow-700
             relative overflow-hidden"
					>
						<span className="relative z-10">Hall Of Fame</span>
						<div
							className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent 
               translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"
						></div>
						<div
							className="absolute inset-0 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 
               animate-fire"
						></div>
					</Link>

					{/* New Analysis Button */}
					<a
						href="https://chess.wintrcat.uk/"
						target="_blank"
						rel="noopener noreferrer"
						className="group h-16 sm:h-20 w-full sm:w-44 text-base sm:text-xl text-center flex flex-col justify-center items-center rounded-xl sm:rounded-2xl 
						bg-gradient-to-br from-cyan-500 via-cyan-600 to-blue-600 text-white 
						shadow-[0_0_10px_rgba(6,182,212,0.3)] sm:shadow-[0_0_20px_rgba(6,182,212,0.5)]
						hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] sm:hover:shadow-[0_0_25px_rgba(6,182,212,0.6)]
						transition-all duration-300 hover:scale-[1.02] sm:hover:scale-105 
						hover:from-cyan-600 hover:via-cyan-700 hover:to-blue-700
						relative overflow-hidden"
					>
						<span className="relative z-10">Analysis</span>
						<div
							className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent 
							translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"
						></div>
					</a>
				</div>

				{/* Welcome Messages */}
				<div className="col-span-2 max-w-2xl mx-auto mt-6 sm:mt-8 space-y-3 sm:space-y-4">
					<div className="text-sm sm:text-base md:text-xl text-center font-medium text-white/90 backdrop-blur-sm bg-white/10 p-3 sm:p-4 rounded-xl">
						Welcome to Chess MBH! Choose an option above to get started.
					</div>

					<div className="text-sm sm:text-base md:text-xl text-center font-medium text-white/90 backdrop-blur-sm bg-white/10 p-3 sm:p-4 rounded-xl">
						The Sunday Tournament winner is <br /> "XYZ 💀"
					</div>
				</div>
				<Videos />
				<Thoughts />

				{renderUserControls()}

				{/* Chat Button with updated styling */}
				<button
					onClick={handleChatClick}
					className="fixed bottom-4 sm:bottom-8 right-4 sm:right-6 bg-white/20 backdrop-blur-md text-white p-4 sm:p-3 rounded-full hover:bg-white/30 transition-all duration-300 shadow-lg z-40"
					aria-label="Open chat"
				>
					<span className="absolute -top-2 -right-1 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[20px] h-5 flex items-center justify-center">
						5+
					</span>
					<IoChatboxEllipses size={20} className="sm:w-6 sm:h-6" />
				</button>

				{/* Modal and Chat components */}
				<LoginModal
					isOpen={isLoginModalOpen}
					onClose={() => setIsLoginModalOpen(false)}
					onLogin={handleLogin}
				/>
				<Chat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} currentUser={currentUser} />
			</div>
		</div>
	);
};

export default Home;
