const mongoose = require("mongoose");
const League = require("./League");

const SeasonSchema = new mongoose.Schema(
  {
    league: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "League",
      required: true,
    },
    leagueId: { type: Number, required: true },
    year: { type: Number, required: true },
    start: { type: String },
    end: { type: String },
    current: { type: Boolean },
  },
  { timestamps: true }
);

SeasonSchema.index({ league: 1, year: 1 }, { unique: true });

const Season = mongoose.model("Season", SeasonSchema);

module.exports = Season;
