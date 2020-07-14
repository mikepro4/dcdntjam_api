const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
	status: Object,
	customUrl: String,
	channelId: String,
	channelInfo: Object,
	googleId: String,
	accessToken: String,
	refreshToken: String,
	profile: Object,
	created: { type: Date, default: Date.now },
	displayName: String,
	username: String,
	bio: String,
	website: String,
	instagramHandle: String,
	tiktokHandle: String,
	youtubeHandle: String
});

mongoose.model("users", userSchema);
