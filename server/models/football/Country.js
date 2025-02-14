const mongoose = require("mongoose");

const CountrySchema = new mongoose.Schema(
  {
    name: { type: String, unique: true, required: true },
    code: { type: String },
    flag: { type: String },
  },
  { timestamps: true }
);

const Country = mongoose.model("Country", CountrySchema);

module.exports = Country;
