const mongoose = require("mongoose");
const Video = mongoose.model("videos");
const _ = require("lodash");

module.exports = app => {
	app.post("/search/videos", async (req, res) => {
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

	if (criteria.video) {
		// query.$text = { $search: criteria.video };

		// _.assign(query, {
		// 	"snippet.title": /criteria.video/
		// });


		_.assign(query, {
			"$or": [
				{"snippet.title": {
					$regex: criteria.video,
					$options: "i"
				}},
				{"snippet.channelTitle": {
					$regex: criteria.video,
					$options: "i"
				}},
				{"snippet.description": {
					$regex: criteria.video,
					$options: "i"
				}}
				
			]
		});

		// _.assign(query, {
		// 	"snippet.title": {
		// 		$regex: criteria.video,
		// 		$options: "i"
		// 	}
			
		// });

		// _.assign(query, {
		// 	"snippet.channelTitle": {
		// 		$regex: criteria.account,
		// 		$options: "i"
		// 	},
		// });


		// _.assign(query, {
		// 	"snippet.title": {
		// 		$regex: new RegExp("^" + criteria.video),
		// 		$options: "i"
		// 	}
		// });
	}

	if (criteria.account) {
		// query.$text = { $search: criteria.search };

		// _.assign(query, {
		// 	"snippet.channelTitle": {
		// 		$regex: new RegExp("^" + criteria.search),
		// 		$options: "i"
		// 	}
		// });

		_.assign(query, {
			"snippet.channelTitle": {
				$regex: criteria.account,
				$options: "i"
			},

		});
	}

	// if (criteria.channelName) {
	// 	_.assign(query, {
	// 		"snippet.channelTitle": {
	// 			$regex: new RegExp("^" + criteria.channelName),
	// 			$options: "i"
	// 		}
	// 	});
	// }
	
	console.log(query)

	return query;
};
