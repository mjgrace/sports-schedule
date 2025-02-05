const mongoose = require("mongoose");

const TimezoneSchema = new mongoose.Schema({
  timezone: { type: String },
});

const Timezone = mongoose.model("Timezone", TimezoneSchema);

module.exports = Timezone;
