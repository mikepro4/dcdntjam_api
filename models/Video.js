const mongoose = require("mongoose");
const { Schema } = mongoose;

const videoSchema = new Schema({
  status: { type: String, default: "draft" },
  claps: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  watchTime: { type: Number, default: 0 },
  goosebumps: { type: Number, default: 0 },
  googleId: String,
	snippet: Object,
	contentDetails: Object,
  created:  {type: Date, default: Date.now},
  addedBy:  {
    displayName: String,
    avatarUrl: String,
    userId: String
  }
});

mongoose.model("videos", videoSchema);
