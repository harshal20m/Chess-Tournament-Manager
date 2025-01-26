import { useState, useEffect } from "react";

const Registration = () => {
	const [formData, setFormData] = useState({
		fullName: "",
		chesscomUsername: "",
		email: "",
		phoneNumber: "",
		playingLevel: "",
	});
	const [message, setMessage] = useState({ text: "", type: "" });
	const [isVerifying, setIsVerifying] = useState(false);
	const [isVerified, setIsVerified] = useState(false);
	const [verificationError, setVerificationError] = useState("");
	const [registrations, setRegistrations] = useState([]);

	useEffect(() => {
		fetchRegistrations();
	}, []);

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const verifyChessUsername = async () => {
		setIsVerifying(true);
		setVerificationError("");
		try {
			const response = await fetch(`https://api.chess.com/pub/player/${formData.chesscomUsername}`);
			if (!response.ok) {
				setVerificationError("Invalid Chess.com username");
				setIsVerified(false);
			} else {
				setIsVerified(true);
			}
		} catch (error) {
			setVerificationError("Failed to verify username");
			setIsVerified(false);
		} finally {
			setIsVerifying(false);
		}
	};

	const fetchRegistrations = async () => {
		try {
			const response = await fetch("https://chess-tournament-manager-na4u.onrender.com/api/register");
			const data = await response.json();
			setRegistrations(data);
		} catch (error) {
			console.error("Failed to fetch registrations:", error);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!isVerified) {
			setVerificationError("Please verify your Chess.com username first");
			return;
		}
		try {
			const response = await fetch("https://chess-tournament-manager-na4u.onrender.com/api/register", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});

			const data = await response.json();

			if (!response.ok) {
				setMessage({
					text: data.message || "Registration failed",
					type: "error",
				});
				return;
			}

			setMessage({ text: "Registration successful!", type: "success" });
			setFormData({
				fullName: "",
				chesscomUsername: "",
				email: "",
				phoneNumber: "",
				playingLevel: "",
			});
			setIsVerified(false);
			fetchRegistrations();
		} catch (error) {
			setMessage({ text: error.message, type: "error" });
		}
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
			<div className="max-w-4xl mx-auto relative z-10">
				<h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 text-center">
					Tournament Registration
				</h2>

				{message.text && (
					<div
						className={`p-4 mb-6 rounded-lg text-center backdrop-blur-md ${
							message.type === "success" ? "bg-green-500/20 text-green-200" : "bg-red-500/20 text-red-200"
						}`}
					>
						{message.text}
					</div>
				)}

				{/* Registration Form */}
				<div className="bg-white/10 backdrop-blur-md rounded-xl p-6 mb-8 border border-white/10">
					<form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="form-group">
							<label className="block text-white mb-2">Full Name</label>
							<input
								type="text"
								name="fullName"
								value={formData.fullName}
								onChange={handleChange}
								className="w-full p-2 border bg-white/10 backdrop-blur-md border-white/20 rounded-lg 
                                    focus:outline-none focus:ring-2 focus:ring-blue-500 
                                    text-white placeholder-gray-400"
								required
							/>
						</div>

						<div className="form-group">
							<label className="block text-white mb-2">Chess.com Username</label>
							<div className="flex gap-2">
								<input
									type="text"
									name="chesscomUsername"
									value={formData.chesscomUsername}
									onChange={handleChange}
									className="w-full p-2 border bg-white/10 backdrop-blur-md border-white/20 rounded-lg 
                                        focus:outline-none focus:ring-2 focus:ring-blue-500 
                                        text-white placeholder-gray-400"
									required
								/>
								<button
									type="button"
									onClick={verifyChessUsername}
									disabled={isVerifying || !formData.chesscomUsername}
									className={`px-4 py-2 rounded-lg transition-colors ${
										isVerified
											? "bg-green-500/80 text-white"
											: "bg-blue-500/80 text-white hover:bg-blue-600/80"
									} disabled:opacity-50`}
								>
									{isVerifying ? "Verifying..." : isVerified ? "Verified" : "Verify"}
								</button>
							</div>
							{verificationError && <p className="text-red-400 text-sm mt-1">{verificationError}</p>}
						</div>

						<div className="form-group">
							<label className="block text-white mb-2">Email</label>
							<input
								type="email"
								name="email"
								value={formData.email}
								onChange={handleChange}
								className="w-full p-2 border bg-white/10 backdrop-blur-md border-white/20 rounded-lg 
                                    focus:outline-none focus:ring-2 focus:ring-blue-500 
                                    text-white placeholder-gray-400"
								required
							/>
						</div>

						<div className="form-group">
							<label className="block text-white mb-2">Phone Number</label>
							<input
								type="tel"
								name="phoneNumber"
								value={formData.phoneNumber}
								onChange={handleChange}
								className="w-full p-2 border bg-white/10 backdrop-blur-md border-white/20 rounded-lg 
                                    focus:outline-none focus:ring-2 focus:ring-blue-500 
                                    text-white placeholder-gray-400"
								required
							/>
						</div>

						<div className="form-group">
							<label className="block text-white mb-2">Playing Level</label>
							<select
								name="playingLevel"
								value={formData.playingLevel}
								onChange={handleChange}
								className="w-full p-2 border bg-white/10 backdrop-blur-md border-white/20 rounded-lg 
                                    focus:outline-none focus:ring-2 focus:ring-blue-500 
                                    text-white"
								required
							>
								<option value="" className="bg-gray-800">
									Select Level
								</option>
								<option value="beginner" className="bg-gray-800">
									Beginner (100+)
								</option>
								<option value="intermediate" className="bg-gray-800">
									Intermediate (500+)
								</option>
								<option value="advanced" className="bg-gray-800">
									Advanced (1000+)
								</option>
								<option value="master" className="bg-gray-800">
									Master (1200+)
								</option>
							</select>
						</div>

						<div className="md:col-span-2 text-center">
							<button
								type="submit"
								disabled={!isVerified}
								className="w-full sm:w-auto bg-gradient-to-r from-blue-500/80 to-purple-600/80 
                                    text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg text-sm sm:text-base 
                                    hover:from-purple-600/80 hover:to-blue-500/80 transition-all duration-300 
                                    hover:scale-105 disabled:opacity-50 backdrop-blur-md"
							>
								Submit Registration
							</button>
						</div>
					</form>
				</div>

				{/* Registered Players */}
				<div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/10">
					<h3 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
						Registered Players
					</h3>

					<div className="space-y-4">
						{registrations.map((reg) => (
							<div
								key={reg._id}
								className="bg-white/5 backdrop-blur-md p-4 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
							>
								<div className="flex justify-between items-start gap-4">
									<div>
										<h4 className="font-semibold text-white">{reg.fullName}</h4>
										<p className="text-sm text-white">{reg.chesscomUsername}</p>
									</div>
									<span className="px-3 py-1 text-xs rounded-full bg-blue-400 text-white capitalize">
										{reg.playingLevel}
									</span>
								</div>
								<div className="text-sm text-white/60 mt-2">
									Registered: {new Date(reg.createdAt).toLocaleDateString()}
								</div>
							</div>
						))}

						{registrations.length === 0 && (
							<p className="text-center text-white/60 py-4">No registrations yet</p>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Registration;
