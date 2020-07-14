const mongoose = require("mongoose");
const Video = mongoose.model("videos");
const _ = require("lodash");

module.exports = app => {
	app.post("/search/videos", async (req, res) => {
        console.log(req.body.criteria)
		const { 
            criteria, 
            sortProperty, 
            offset, 
            limit 
        } = req.body;
		const query = Video.find(buildQuery(criteria))
			.sort({ [sortProperty]: -1 })
			.skip(offset)
			.limit(limit);

		return Promise.all([query, Video.find(buildQuery(criteria)).count()]).then(
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
};

const buildQuery = criteria => {
	const query = {};

    if (criteria.channelId) {
		_.assign(query, {
            channelId: { $eq: criteria.channelId } 
		});
    }
    
    if (criteria.submittedBy) {
		_.assign(query, {
            submittedBy: { $eq: criteria.submittedBy } 
		});
	}

	return query;
};
