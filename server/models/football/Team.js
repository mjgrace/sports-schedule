const mongoose = require("mongoose");
const Venue = require("./Venue");

const TeamSchema = new mongoose.Schema(
  {
    teamId: { type: Number },
    league: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "League",
      required: true,
    },
    leagueId: { type: Number, required: true },
    year: { type: Number, required: true },
    name: { type: String },
    code: { type: String },
    country: { type: String },
    founded: { type: Number },
    national: { type: Boolean },
    logo: { type: String },
    venue: { type: mongoose.Schema.Types.ObjectId, ref: "Venue" },
  },
  { timestamps: true }
);

TeamSchema.index({ teamId: 1, leagueId: 1, year: 1 }, { unique: true });

const Team = mongoose.model("Team", TeamSchema);

module.exports = Team;
