import { useState } from "react";

const LoginModal = ({ isOpen, onClose, onLogin }) => {
	const [isLoginMode, setIsLoginMode] = useState(true);
	const [formData, setFormData] = useState({
		username: "",
		password: "",
	});
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setIsLoading(true);

		const endpoint = isLoginMode ? "login" : "register";

		try {
			const response = await fetch(
				`https://l7jkcepdx1.execute-api.us-east-1.amazonaws.com/dev/api/auth/${endpoint}`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(formData),
				}
			);

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.message || "Something went wrong");
			}

			if (isLoginMode) {
				onLogin(formData.username);
				onClose();
			} else {
				setIsLoginMode(true);
				setError("Registration successful! Please log in.");
			}
			setFormData({ username: "", password: "" });
		} catch (err) {
			setError(err.message || "Failed to process request. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	const toggleMode = () => {
		setIsLoginMode(!isLoginMode);
		setError("");
		setFormData({ username: "", password: "" });
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
			<div className="bg-white rounded-lg p-6 w-full max-w-md">
				<h2 className="text-xl font-bold mb-4 text-gray-800">{isLoginMode ? "Login" : "Register"}</h2>
				<form onSubmit={handleSubmit} className="space-y-4">
					<input
						type="text"
						value={formData.username}
						onChange={(e) => setFormData({ ...formData, username: e.target.value })}
						placeholder="Username"
						className="w-full p-2 border border-gray-300 rounded"
						required
					/>
					<input
						type="password"
						value={formData.password}
						onChange={(e) => setFormData({ ...formData, password: e.target.value })}
						placeholder="Password"
						className="w-full p-2 border border-gray-300 rounded"
						required
					/>
					{error && (
						<div
							className={`text-sm mb-4 ${
								error.includes("successful") ? "text-green-500" : "text-red-500"
							}`}
						>
							{error}
						</div>
					)}
					<div className="flex flex-col gap-2">
						<button
							type="submit"
							disabled={isLoading}
							className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300 transition-colors"
						>
							{isLoading ? "Processing..." : isLoginMode ? "Login" : "Register"}
						</button>
						<button
							type="button"
							onClick={toggleMode}
							className="w-full px-4 py-2 text-blue-500 hover:text-blue-700 transition-colors"
						>
							{isLoginMode ? "Need an account? Register" : "Already have an account? Login"}
						</button>
						<button
							type="button"
							onClick={onClose}
							className="w-full px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
						>
							Cancel
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default LoginModal;
