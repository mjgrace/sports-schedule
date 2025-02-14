const mongoose = require("mongoose");

const TimezoneSchema = new mongoose.Schema(
  {
    timezone: { type: String },
  },
  { timestamps: true, required: true, unique: true }
);

const Timezone = mongoose.model("Timezone", TimezoneSchema);

module.exports = Timezone;
