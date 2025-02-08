const mongoose = require('mongoose');
const Venue = require('./Venue');

const TeamSchema = new mongoose.Schema({
    id: { type: Number },
    name: { type: String },
    code: { type: String },
    country: { type: String },
    founded: { type: Number },
    national: { type: Boolean },
    logo: { type: String },
    coverage: { type: mongoose.Schema.Types.ObjectId, ref: "Venue" },
}, { timestamps: true });

const Team = mongoose.model("Team", TeamSchema);

module.exports = Team;
