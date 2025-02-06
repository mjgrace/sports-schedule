const mongoose = require("mongoose");

const TimezoneSchema = new mongoose.Schema({
  timezone: { type: String },
}, { timestamps: true });

const Timezone = mongoose.model("Timezone", TimezoneSchema);

module.exports = Timezone;
