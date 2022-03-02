const mongoose = require("mongoose");

const characterSchema = mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
});

const Character = mongoose.model("Character", characterSchema);

module.exports = Character;
