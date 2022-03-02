const mongoose = require("mongoose");

const designSchema = mongoose.Schema({});

const Design = mongoose.model("Design", designSchema);

module.exports = Design;
