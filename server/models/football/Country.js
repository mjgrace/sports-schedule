const mongoose = require("mongoose");

const CountrySchema = new mongoose.Schema({
  name: { type: String },
  code: { type: String },
  flag: { type: String },
});

const Country = mongoose.model("Country", CountrySchema);

module.exports = Country;
