const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema(
	{
		fullName: {
			type: String,
			required: true,
		},
		chesscomUsername: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
		phoneNumber: {
			type: String,
			required: true,
		},
		playingLevel: {
			type: String,
			enum: ["beginner", "intermediate", "advanced", "master"],
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Registration", registrationSchema);
