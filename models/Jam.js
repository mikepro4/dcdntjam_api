const mongoose = require("mongoose");
const { Schema } = mongoose;

const jamSchema = new Schema({
  metadata: {
    jamCoverUrl: String,
    artistName: String,
    artistNameFontSize: Number,
    artistNameFontFamily: String,
    videoName: String,
    videoameFontSize: Number,
    videoNameFontFamily: String,
    duration: Number,
    audioUrl: String,
    createdBy: String,
    createdAt: { type: Date, default: Date.now }
  },
  status: { type: String, default: "draft" },
  likes: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  goosebumps: { type: Number, default: 0 }
});

mongoose.model("jam", jamSchema);
