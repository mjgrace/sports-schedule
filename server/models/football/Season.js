const mongoose = require("mongoose");
const Coverage = require("./Coverage");

const SeasonSchema = new mongoose.Schema({
  year: { type: Number },
  start: { type: String },
  end: { type: String },
  current: { type: Boolean },
  coverage: { type: mongoose.Schema.Types.ObjectId, ref: "Coverage" },
});

const Season = mongoose.model("Season", SeasonSchema);

module.exports = Season;
