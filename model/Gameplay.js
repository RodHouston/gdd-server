const mongoose = require("mongoose");

const gameplaySchema = mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
});

module.exports = gameplaySchema;
