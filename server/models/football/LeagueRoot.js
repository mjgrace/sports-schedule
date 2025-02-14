const mongoose = require("mongoose");
const League = require("./League");
const Country = require("./Country");
const Season = require("./Season");

const LeagueRootSchema = new mongoose.Schema(
  {
    get: { type: String },
    parameters: { type: Object },
    errors: { type: [String] },
    results: { type: Number },
    paging: {
      current: { type: Number },
      total: { type: Number },
    },
    response: [
      {
        league: { type: mongoose.Schema.Types.ObjectId, ref: "League" },
        country: { type: mongoose.Schema.Types.ObjectId, ref: "Country" },
        seasons: [{ type: mongoose.Schema.Types.ObjectId, ref: "Season" }],
      },
    ],
  },
  { timestamps: true }
);

const LeagueRoot = mongoose.model("LeagueRoot", LeagueRootSchema);

module.exports = LeagueRoot;
