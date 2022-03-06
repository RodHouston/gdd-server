const mongoose = require("mongoose");
const GENRE = require("../utils/genres");
const characterSchema = require("./Character");
const gameplaySchema = require("./Gameplay");
const itemSchema = require("./Item");
const locationSchema = require("./Location");

const designSchema = mongoose.Schema({
  image: { type: String, required: true },
  name: { type: String, required: true },
  description: String,
  //   budget: Number,
  //   deadline: Date,
  monetization: String,
  story: String,
  creator: { type: mongoose.Schema.Types.ObjectId, required: true },
  collaborators: [{ type: mongoose.Schema.Types.ObjectId, required: true }],
  collabRequestUsers: [
    { type: mongoose.Schema.Types.ObjectId, required: true },
  ],
  gameplay: [gameplaySchema],
  characters: [characterSchema],
  locations: [locationSchema],
  items: [itemSchema],
  gameLoop: [String],
  stretchGoals: [String],
  genre: { type: String, required: true, enum: GENRE },
  deleted: { type: Boolean, required: true },
});

const Design = mongoose.model("Design", designSchema);

module.exports = Design;
