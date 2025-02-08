const mongoose = require("mongoose");

const SeasonSchema = new mongoose.Schema({
  year: { type: Number },
  start: { type: String },
  end: { type: String },
  current: { type: Boolean }
}, { timestamps: true });

const Season = mongoose.model("Season", SeasonSchema);

module.exports = Season;
