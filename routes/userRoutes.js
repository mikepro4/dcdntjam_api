const keys = require("../config/keys");
const requireLogin = require("../middleware/requireLogin");
const axios = require("axios");
const _ = require("lodash");
const mongoose = require("mongoose");
const Users = mongoose.model("users");

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

}
