import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { IoInformationCircle } from "react-icons/io5";

const Header = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const [showInfo, setShowInfo] = useState(false);

	return (
		<>
			<header className="fixed top-0 w-full bg-gray-900 text-white py-4 px-6 flex items-center justify-between z-50">
				<div className="flex items-center">
					{location.pathname !== "/" && (
						<button onClick={() => navigate("/")} className="mr-4 hover:text-blue-400 transition-colors">
							<IoArrowBack size={24} />
						</button>
					)}
					<h1 className="text-xl font-bold">Chess</h1>
				</div>

				<button
					onClick={() => setShowInfo(true)}
					className="hover:text-blue-400 transition-colors"
					aria-label="Show information"
				>
					<IoInformationCircle size={24} />
				</button>
			</header>

			{/* Info Modal */}
			{showInfo && (
				<div
					className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
					onClick={() => setShowInfo(false)}
				>
					<div
						className="bg-white text-gray-900 p-6 rounded-lg shadow-xl max-w-sm mx-4 relative"
						onClick={(e) => e.stopPropagation()}
					>
						<button
							onClick={() => setShowInfo(false)}
							className="absolute -top-2 -right-2 bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors text-sm font-bold"
						>
							×
						</button>
						<h2 className="text-xl font-bold mb-4 text-center">About</h2>
						<p className="mb-4">Created by Harshal Mali</p>
						<p className="mb-4 text-center">
							<a
								href="https://harshalmali.online"
								className="font-bold text-xl text-blue-500 hover:text-blue-700 hover:underline transform hover:scale-105 transition-all duration-200 inline-block cursor-pointer"
							>
								&lt; HM &gt;
							</a>
						</p>
					</div>
				</div>
			)}
		</>
	);
};

export default Header;
