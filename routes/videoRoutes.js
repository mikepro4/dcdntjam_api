const keys = require("../config/keys");
const requireLogin = require("../middleware/requireLogin");
const axios = require("axios");
const { google } = require("googleapis");

const mongoose = require("mongoose");
const Video = mongoose.model("videos");
const Users = mongoose.model("users");
// const OAuth2 = require("google-oauth2")
const OAuth2 = google.auth.OAuth2;

module.exports = app => {

	app.post("/youtube_video_details", requireLogin, async (req, res) => {
		Video.findOne(
			{
				googleId: req.body.googleId
			},
			async (err, video) => {
				if(err) {
					console.log(err)
				}
				if (video) {
					res.json({
						newVideo: false,
						videoDetails: video
					});
				} else {
					console.log(`https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${
							req.body.googleId
						}&key=${keys.youtubeAPI}`
					)
					const searchReq = await axios.get(
						`https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${
							req.body.googleId
						}&key=${keys.youtubeAPI}`
					);

					res.json({
						newVideo: true,
						videoDetails: {
							googleId: searchReq.data.items[0].id,
							snippet: searchReq.data.items[0].snippet,
							contentDetails: searchReq.data.items[0].contentDetails
						}
					});
				}
			}
		);
	});

	app.post("/youtube_video_add", requireLogin, async (req, res) => {
		console.log(req.body.userId)
		Video.findOne(
			{ googleId: req.body.googleId },
			"googleId",
			async (err, video) => {
				if (video) {
					res.json(video);
				} else {
					const video = await new Video({
						googleId: req.body.googleId,
						channelId: req.body.channelId,
						snippet: req.body.snippet,
						contentDetails: req.body.contentDetails,
						submittedBy: req.body.userId,
						channelAvatar: req.body.channelAvatar
					}).save();
					res.json(video);
				}
			}
		);
	});

	
	app.post("/load_video_details", async (req, res) => {
		Video.findOne({ googleId: req.body.googleId }, async (err, video) => {
			if (video) {
				res.json(video);
			}
		});
	});

	app.post("/video/view", async (req, res) => {
		Video.update(
			{
				googleId: req.body.googleId,
			},
			{
				$inc: { views: 1 } 
			},
			async (err, info) => {
				if (err) res.status(400).send({ error: "true", error: err });
				if (info) {
					Video.findOne({ googleId: req.body.googleId }, async (err, user) => {
						if (user) {
							res.json(user);
						}
					});
				}
			}
		);
	});
 
};
