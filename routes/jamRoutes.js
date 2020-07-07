const keys = require("../config/keys");
const requireLogin = require("../middlewares/requireLogin");
const axios = require("axios");
const _ = require("lodash");
const mongoose = require("mongoose");
const Jam = mongoose.model("jam");

module.exports = app => {

	// ===========================================================================

	app.post("/jams/search", async (req, res) => {
		const { criteria, sortProperty, offset, limit } = req.body;
		const query = Jam.find(buildQuery(criteria))
			.sort({ [sortProperty]: -1 })
			.skip(offset)
			.limit(limit);

		return Promise.all(
			[query, Jam.find(buildQuery(criteria)).countDocuments()]
		).then(
			results => {
				return res.json({
					all: results[0],
					count: results[1],
					offset: offset,
					limit: limit
				});
			}
		);
	});

	// ===========================================================================

	app.post("/jams/create", requireLogin, async (req, res) => {
		let updateJamMetadata = _.assign({}, req.body.metadata, {
			createdBy: req.user._id,
			createdAt: new Date()
		});

		let updatedJam = _.assign({}, req.body, {
			metadata: updateJamMetadata
		});
		const jam = await new Jam(updatedJam).save();
		res.json(jam);
	});

	// ===========================================================================

	app.post("/jams/update", requireLogin, async (req, res) => {
    console.log(req.body)
		Jam.update(
			{
				_id: req.body.jamId
			},
			{
				$set: req.body.newJam
			},
			async (err, info) => {
				if (err) res.status(400).send({ error: "true", error: err });
				if (info) {
					Jam.findOne({ _id: req.body.jamId }, async (err, jam) => {
						if (jam) {
							res.json({ success: "true", info: info, jam: jam });
						}
					});
				}
			}
		);
	});

	// ===========================================================================

	app.post("/jams/delete", requireLogin, async (req, res) => {
		Jam.remove({ _id: req.body.jamId }, async (err, video) => {
			if (err) return res.send(err);
			res.json({
				success: "true",
				message: "deleted  jam"
			});
		});
	});

	// ===========================================================================

	app.post("/jams/details", async (req, res) => {
		Jam.findOne({ _id: req.body.jamId }, async (err, jam) => {
			if (jam) {
				res.json(jam);
			}
		});
	});

	// ===========================================================================
};

const buildQuery = criteria => {
	const query = {};

	if (criteria.userId) {
		_.assign(query, {
			"metadata.createdBy": {
				$eq: criteria.userId
			}
		});
	}
};
