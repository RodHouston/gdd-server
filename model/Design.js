const mongoose = require("mongoose");
const characterSchema = require("./Character");
const collaboratorRoleSchema = require("./CollaboratorRole");
const gameplaySchema = require("./Gameplay");
const itemSchema = require("./Item");
const locationSchema = require("./Location");

const designSchema = mongoose.Schema({
  image: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  //   budget: Number,
  //   deadline: Date,
  monetization: { type: String, required: true },
  story: { type: String, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, required: true },
  collaborators: [collaboratorRoleSchema],
  gameplay: [gameplaySchema],
  characters: [characterSchema],
  locations: [locationSchema],
  items: [itemSchema],
  gameLoop: [{ type: String, required: true }],
  stretchGoals: [{ type: String, required: true }],
  deleted: { type: Boolean, required: true },
});

const Design = mongoose.model("Design", designSchema);

module.exports = Design;
