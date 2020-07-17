const mongoose = require("mongoose");
const User = mongoose.model("users");
const _ = require("lodash");

module.exports = app => {
	app.post("/search/users", async (req, res) => {
		const { 
            criteria, 
            sortProperty, 
            offset, 
            limit 
        } = req.body;
		const query = User.find(buildQuery(criteria))
			.sort({ [sortProperty]: -1 })
			.skip(offset)
			.limit(limit);

		return Promise.all([query, User.find(buildQuery(criteria)).count()]).then(
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

	if (criteria.account) {
		_.assign(query, {
			"$or": [
				{"channelInfo.title": {
					$regex: criteria.account,
					$options: "i"
				}},
				{"customUrl": {
					$regex: criteria.account,
					$options: "i"
				}},
				{"displayName": {
					$regex: criteria.account,
					$options: "i"
				}}
				
			]
		})
	}
	
	console.log(query)

	return query;
};
