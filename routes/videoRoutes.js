const keys = require("../config/keys");
const requireLogin = require("../middleware/requireLogin");
const axios = require("axios");
const { google } = require("googleapis");

const mongoose = require("mongoose");
const Video = mongoose.model("videos");
// const OAuth2 = require("google-oauth2")
const OAuth2 = google.auth.OAuth2;

const YOUTUBE_API_KEY = "AIzaSyAzvjjStBKyUYtoEwKWwR5XFVassNhrnSc"
// const YOUTUBE_API_KEY = "AIzaSyBEtIaWbwlrZyxjz43bSQAVxgrk21Od9zg"


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
						}&key=${YOUTUBE_API_KEY}`
					)
					const searchReq = await axios.get(
						`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${
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
		Video.findOne(
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

	app.post("/get_channel_id", async (req, res) => {

		// var oauth2Client = new OAuth2({
		// 	client_id: keys.clientID,
		// 	client_secret: keys.googleClientSecret
		// });

		var oauth2Client = new OAuth2(keys.googleClientID, keys.googleClientSecret, "http://localhost:5000/api/auth/google/callback");

		oauth2Client.credentials = {
			access_token: req.body.accessToken
		}

		// const searchReq = await axios.get(
		// 	`https://www.googleapis.com/youtube/v3/channels?mine=truepart=snippet&key=${YOUTUBE_API_KEY}`
		// );

		// const searchReq = await axios.request({
		// 	url: `https://www.googleapis.com/youtube/v3/channels?mine=true&part=snippet&key=${YOUTUBE_API_KEY}`,
		// 	method: "get",
		// 	headers: {
		// 		Authorization: 'Bearer ' + req.body.accessToken,
		// 		Accept: 'application/json',
		// 		auth: oauth2Client

		// 	  }
		//   })
		//   console.log(searchReq)

		// res.json({
		// 	response: searchReq.data
		// });

		console.log(oauth2Client)
		google.youtube({
				version: "v3",
				auth: oauth2Client
			}).channels.list(
				{
					part: "snippet",
					mine: "true",
					headers: {
						Authorization: 'Bearer ' + req.body.accessToken,
						Accept: 'application/json',
					}
				},
				function(err, data, response) {
					if (err) {
						console.error("Error: " + err);
						res.json({
							status: "error",
							err: err,
							data: response
						});
					}
					if (data) {
						console.log(data);
						res.json({
							status: "ok",
							data: data
						});
					}
					if (response) {
						console.log(response);
						console.log("Status code: " + response.statusCode);
					}
				}
			);
	});
};
