const mongoose = require('mongoose');

const VenueSchema = new mongoose.Schema({
    id: { type: Number },
    name: { type: String },
    address: { type: String },
    city: { type: String },
    capacity: { type: Number },
    surface: { type: String },
    image: { type: String }
}, { timestamps: true });

const Venue = mongoose.model("Venue", VenueSchema);

module.exports = Venue;
