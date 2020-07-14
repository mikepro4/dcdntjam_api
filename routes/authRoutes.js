const passport = require("passport");
const mongoose = require("mongoose");
const Users = mongoose.model("users");

module.exports = app => {
	app.get(
		"/auth/google",
		passport.authenticate("google", {
			scope: [
				"profile",
				"email",
				"https://www.googleapis.com/auth/youtube",
				"https://www.googleapis.com/auth/youtube.channel-memberships.creator"
			],
			accessType: 'offline',
			approvalPrompt: 'force'
		})
	);

	app.get(
		"/auth/google/callback",
		passport.authenticate("google"),
		(req, res) => {
			res.redirect("/"); // change page here
		}
	);

	app.get(
		"/api/auth/google/callback",
		passport.authenticate("google"),
		(req, res) => {
			res.redirect("/");
		}
	);

	app.get("/logout", (req, res) => {
		req.logout();
		res.redirect("/");
	});

	app.get("/current_user", (req, res) => {
		// const { criteria, sortProperty, offset, limit } = req.body;
		// const query = User.find({
		// 	profileId: req.user.profile.googleId
		// })
		// 	.sort({ [sortProperty]: -1 })
		// 	.skip(offset)
		// 	.limit(limit);

		// return Promise.all(
		// 	[query, User.find(buildQuery(criteria)).countDocuments()]
		// ).then(
		// 	results => {
		// 		return res.json({
		// 			all: results[0],
		// 			count: results[1],
		// 			offset: offset,
		// 			limit: limit,
		// 			googleInfo: req.user
		// 		});
		// 	}
		// );
		if (req.user) {
			Users.findOne(
				{
					googleId: req.user.googleId
				},
				async (err, user) => {
					if (user) {
						res.json(user)
					}
				}
			);
		} else {
			res.json()
		}
		
	});

	app.post("/current_user_by_url", (req, res) => {
		Users.findOne(
			{
				customUrl: req.body.customUrl
			},
			async (err, user) => {
				if (user) {
					res.json(user)
				} else {
					res.json(null)
				}
			}
		);
		
	});

	app.post("/current_user_by_channelId", (req, res) => {
		Users.findOne(
			{
				channelId: req.body.channelId
			},
			async (err, user) => {
				console.log(user)
				if (user) {
					res.json(user)
				} else {
					res.json(null)
				}
			}
		);
		
	});
};

const buildQuery = criteria => {
	const query = {};
};

