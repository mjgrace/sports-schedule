const mongoose = require("mongoose");

const CoverageSchema = new mongoose.Schema({
  fixtures: {
    events: { type: Boolean },
    lineups: { type: Boolean },
    statistics_fixtures: { type: Boolean },
    statistics_players: { type: Boolean },
  },
  standings: { type: Boolean },
  players: { type: Boolean },
  top_scorers: { type: Boolean },
  top_assists: { type: Boolean },
  top_cards: { type: Boolean },
  injuries: { type: Boolean },
  predictions: { type: Boolean },
  odds: { type: Boolean },
});

const Coverage = mongoose.model("Coverage", CoverageSchema);

module.exports = Coverage;
