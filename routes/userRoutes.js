const keys = require("../config/keys");
const requireLogin = require("../middleware/requireLogin");
const axios = require("axios");
const _ = require("lodash");
const mongoose = require("mongoose");
const Users = mongoose.model("users");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;


module.exports = app => {

	app.post("/user/update", requireLogin, async (req, res) => {
		Users.update(
			{
				_id: req.body._id
			},
			{
				$set: req.body
			},
			async (err, info) => {
				if (err) res.status(400).send({ error: "true", error: err });
				if (info) {
					Users.findOne({ _id: req.body._id }, async (err, user) => {
						if (user) {
							res.json(user);
						}
					});
				}
			}
        );
	})
	
	app.post("/user", async (req, res) => {
		Users.findOne({ googleId: req.body.googleId }, async (err, user) => {
			if (user) {
				res.json(user);
			}
		});
	})

	app.post("/user_by_customUrl", async (req, res) => {
		Users.findOne({ customUrl: req.body.customUrl }, async (err, user) => {
			if (user) {
				res.json(user);
			}
		});
	})
	
	app.post("/update_token", requireLogin, async (req, res) => {
		// const searchReq = await axios.request({
		// 	url: `https://oauth2.googleapis.com/token`,
		// 	method: "post",
		// 	client_id: keys.googleClientID,
		// 	client_secret: keys.googleClientSecret,
		// 	refresh_token: req.body.refreshToken,
		// 	grant_type: "refresh_token"
		//   })
		// console.log(searchReq)
		// console.log(req.body.refreshToken)

		const searchReq = await axios.post("https://oauth2.googleapis.com/token", {
			client_id: keys.googleClientID,
			client_secret: keys.googleClientSecret,
			refresh_token: req.body.refreshToken,
			grant_type: "refresh_token"
		})

		Users.update(
			{
				refreshToken: req.body.refreshToken
			},
			{
				$set:  {
					accessToken: searchReq.data.access_token
				}
			},
			async (err, info) => {
				if (err) res.status(400).send({ error: "true", error: err });
				if (info) {
					Users.findOne({ refreshToken: req.body.refreshToken }, async (err, user) => {
						if (user) {
							res.json(user);
						}
					});
				}
			}
		);
	})

	app.post("/update_channel_id", async (req, res) => {


		var oauth2Client = new OAuth2(keys.googleClientID, keys.googleClientSecret, "http://localhost:5000/api/auth/google/callback");

		oauth2Client.credentials = {
			access_token: req.body.accessToken
		}

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
						// Users.update(
						// 	{
						// 		accessToken: req.body.accessToken
						// 	},
						// 	{
						// 		$set: {
						// 			status: {
						// 				type: "watcher",
						// 				date: new Date()
						// 			},
						// 		}
						// 	},
						// 	async (err, info) => {
						// 		if (err) res.status(400).send({ error: "true", error: err });
						// 		if (info) {
						// 			Users.findOne({ accessToken: req.body.accessToken}, async (err, user) => {
						// 				if (user) {
						// 					res.json(user);
						// 				}
						// 			});
						// 		}
						// 	}
						// );
					}
					if (data) {
						// res.json({
						// 	status: "ok",
						// 	data: data
						// });

						console.log(data)

						if(data.data.items) {
							let channelInfo = data.data.items[0];

							Users.update(
								{
									accessToken: req.body.accessToken
								},
								{
									$set: {
										status: {
											type: "channelOwner",
											date: new Date()
										},
										customUrl: channelInfo.snippet.customUrl,
										channelId: channelInfo.id,
										channelInfo: channelInfo.snippet
									}
								},
								async (err, info) => {
									if (err) res.status(400).send({ error: "true", error: err });
									if (info) {
										Users.findOne({ accessToken: req.body.accessToken}, async (err, user) => {
											if (user) {
												res.json(user);
											}
										});
									}
								}
							);
						} else {
							Users.update(
								{
									accessToken: req.body.accessToken
								},
								{
									$set: {
										status: {
											type: "watcher",
											date: new Date()
										},
									}
								},
								async (err, info) => {
									if (err) res.status(400).send({ error: "true", error: err });
									if (info) {
										Users.findOne({ accessToken: req.body.accessToken}, async (err, user) => {
											if (user) {
												res.json(user);
											}
										});
									}
								}
							);
						}
					}
					if (response) {
						console.log(response);
						console.log("Status code: " + response.statusCode);
					}
				}
			);
	});

}
