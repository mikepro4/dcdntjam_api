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
						if (jam) {
							res.json(user);
						}
					});
				}
			}
        );
    })

}
