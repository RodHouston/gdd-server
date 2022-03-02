const mongoose = require("mongoose");
const Character = require("./Character");
const CollaboratorRole = require("./CollaboratorRole");
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
  collaborators: [CollaboratorRole],
  gameplay: [Gameplay],
  characters: [Character],
  locations: [Location],
  items: [Item],
  gameLoop: [{ type: String, required: true }],
  stretchGoals: [{ type: String, required: true }],
  deleted: { type: Boolean, required: true },
});

const Design = mongoose.model("Design", designSchema);

module.exports = Design;
