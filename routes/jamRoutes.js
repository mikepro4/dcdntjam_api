const keys = require("../config/keys");
const requireLogin = require("../middleware/requireLogin");
const axios = require("axios");
const google = require("googleapis");

const mongoose = require("mongoose");
const Jam = mongoose.model("jam");

const YOUTUBE_API_KEY = "AIzaSyAzvjjStBKyUYtoEwKWwR5XFVassNhrnSc"

module.exports = app => {

	app.post("/youtube_video_details", requireLogin, async (req, res) => {
		Jam.findOne(
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
					const searchReq = await axios.get(
						`https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${
							req.body.googleId
						}&key=${YOUTUBE_API_KEY}`
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
		Jam.findOne(
			{ googleId: req.body.googleId },
			"googleId",
			async (err, video) => {
				if (video) {
					res.json(video);
				} else {
					const video = await new Video({
						googleId: req.body.googleId,
						snippet: req.body.snippet,
						contentDetails: req.body.contentDetails
					}).save();
					res.json(video);
				}
			}
		);
	});
};
