const mongoose = require("mongoose");

const gameplaySchema = mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
});

const Gameplay = mongoose.model("Gameplay", gameplaySchema);

module.exports = Gameplay;
