const mongoose = require("mongoose");

const locationSchema = mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
});

const Location = mongoose.model("Location", locationSchema);

module.exports = Location;
