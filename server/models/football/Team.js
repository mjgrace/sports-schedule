const mongoose = require('mongoose');
const VenueSchema = require('./Venue');

const TeamSchema = new mongoose.Schema({
    id: { type: Number },
    name: { type: String },
    code: { type: String },
    country: { type: String },
    founded: { type: Number },
    national: { type: Boolean },
    logo: { type: String },
    venue: { type: VenueSchema } // Embedded venue schema
}, { timestamps: true });

const Team = mongoose.model("Team", TeamSchema);

module.exports = Team;
