const mongoose = require("mongoose");

const LeagueSchema = new mongoose.Schema(
  {
    id: { type: Number },
    name: { type: String },
    type: { type: String },
    logo: { type: String },
    countryName: { type: String },
  },
  { timestamps: true }
);

const League = mongoose.model("League", LeagueSchema);

module.exports = League;
