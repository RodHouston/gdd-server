const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  image: { type: String, required: true },
  designs: [{ type: mongoose.Schema.Types.ObjectId }], // list of my designs
  collabs: [{ type: mongoose.Schema.Types.ObjectId }], // list of designs I'm a collaborator
  company: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  collabRequests: [{ type: mongoose.Schema.Types.ObjectId }], // requests from other users to join your project
  acceptedRequests: [{ type: mongoose.Schema.Types.ObjectId }],
  collaboratorIds: [{ type: mongoose.Schema.Types.ObjectId }], // your requests that have been accepted
});

const User = mongoose.model("User", userSchema);

module.exports = User;
