const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema(
	{
		chesscomUsername: {
			type: String,
			required: true,
			unique: true,
		},
		registrationId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Registration",
			required: true,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Player", playerSchema);
