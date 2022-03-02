const mongoose = require("mongoose");

const collaboratorRoleSchema = mongoose.Schema({
  id: { type: mongoose.Schema.Types.ObjectId, required: true },
  role: { type: String, required: true },
});

const CollaboratorRole = mongoose.model(
  "CollaboratorRole",
  collaboratorRoleSchema
);

module.exports = CollaboratorRole;
