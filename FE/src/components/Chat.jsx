import { useState, useEffect, useRef } from "react";
import { IoClose } from "react-icons/io5";

const Chat = ({ isOpen, onClose, currentUser }) => {
	const [messages, setMessages] = useState([]);
	const [newMessage, setNewMessage] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const messagesEndRef = useRef(null);

	// Add click outside handler
	const chatRef = useRef(null);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (chatRef.current && !chatRef.current.contains(event.target) && isOpen) {
				onClose();
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isOpen, onClose]);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	const fetchMessages = async () => {
		try {
			const response = await fetch("https://chess-tournament-manager-na4u.onrender.com/api/messages");
			const data = await response.json();
			setMessages(data);
			scrollToBottom();
		} catch (err) {
			console.error("Error fetching messages:", err);
		}
	};

	useEffect(() => {
		if (isOpen) {
			fetchMessages();
			// Poll for new messages every 3 seconds
			const interval = setInterval(fetchMessages, 3000);
			return () => clearInterval(interval);
		}
	}, [isOpen]);

	const handleSend = async (e) => {
		e.preventDefault();
		if (!newMessage.trim() || !currentUser) return;

		setIsLoading(true);
		try {
			const response = await fetch("https://chess-tournament-manager-na4u.onrender.com/api/messages", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					username: currentUser,
					content: newMessage.trim(),
				}),
			});

			if (response.ok) {
				setNewMessage("");
				fetchMessages();
			}
		} catch (err) {
			console.error("Error sending message:", err);
		} finally {
			setIsLoading(false);
		}
	};

	// Add keyboard shortcut to close chat
	useEffect(() => {
		const handleEscKey = (event) => {
			if (event.key === "Escape" && isOpen) {
				onClose();
			}
		};

		document.addEventListener("keydown", handleEscKey);
		return () => {
			document.removeEventListener("keydown", handleEscKey);
		};
	}, [isOpen, onClose]);

	return (
		<div
			className={`fixed right-0 top-0 h-full w-[85vw] sm:w-80 bg-gray-900 text-white transform transition-transform duration-300 ease-in-out z-40 ${
				isOpen ? "translate-x-0" : "translate-x-full"
			}`}
			ref={chatRef}
		>
			<div className="flex flex-col h-full">
				<div className="p-3 sm:p-4 border-b border-gray-700">
					<div className="flex justify-between items-center">
						<h2 className="text-lg sm:text-xl font-bold">Chat Room</h2>
						<button
							onClick={onClose}
							className="p-1 hover:bg-gray-700 rounded-full transition-colors duration-200 group"
							aria-label="Close chat"
						>
							<IoClose
								size={20}
								className="sm:w-6 sm:h-6 text-gray-400 group-hover:text-white transition-colors"
							/>
						</button>
					</div>
				</div>

				<div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
					{messages.length === 0 ? (
						<div className="flex items-center justify-center h-full">
							<p className="text-xs sm:text-sm text-gray-400 text-center">
								No messages yet.
								<br />
								Be the first one to send a message!
							</p>
						</div>
					) : (
						messages.map((msg) => (
							<div
								key={msg._id}
								className={`flex flex-col ${
									msg.username === currentUser ? "items-end" : "items-start"
								}`}
							>
								<span className="text-[10px] sm:text-xs text-gray-400">
									{msg.username.split("@")[0]}
								</span>
								<div
									className={`max-w-[85%] rounded-lg px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm ${
										msg.username === currentUser ? "bg-blue-600" : "bg-gray-700"
									}`}
								>
									{msg.content}
								</div>
							</div>
						))
					)}
					<div ref={messagesEndRef} />
				</div>

				{/* Add keyboard shortcut hint */}
				<div className="px-3 py-1.5 sm:px-4 sm:py-2 text-[10px] sm:text-xs text-gray-400 text-center border-t border-gray-700 cursor-pointer hover:bg-gray-800">
					Press ESC to close chat or click here
				</div>

				{/* Input Area */}
				<form onSubmit={handleSend} className="p-3 sm:p-4 border-t border-gray-700">
					<div className="flex gap-2">
						<input
							type="text"
							value={newMessage}
							onChange={(e) => setNewMessage(e.target.value)}
							placeholder={currentUser ? "Type a message..." : "Please log in to send a message"}
							className="flex-1 bg-gray-800 text-white text-sm rounded-lg px-3 py-1.5 sm:px-4 sm:py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
							disabled={isLoading}
						/>
						<button
							type="submit"
							disabled={isLoading || !newMessage.trim()}
							className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-800 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg transition-colors text-sm"
						>
							Send
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default Chat;
