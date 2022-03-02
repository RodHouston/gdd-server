const mongoose = require("mongoose");
const Character = require("./Character");
const Gameplay = require("./Gameplay");
const Item = require("./Item");
const Location = require("./Location");

const designSchema = mongoose.Schema({
  image: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  budget: Number,
  deadline: Date,
  monetization: { type: String, required: true },
  story: { type: String, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, required: true },
  collaborators: [mongoose.Schema.Types.ObjectId],
  gameplay: [Gameplay],
  characters: [Character],
  locations: [Location],
  items: [Item],
  gameLoop: [{ type: String, required: true }],
  stretchGoals: [{ type: String, required: true }],
});

const Design = mongoose.model("Design", designSchema);

module.exports = Design;
