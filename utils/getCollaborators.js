const User = require("../model/User");

const getCollaborators = async (designDoc) => {
  let collaborators = [];
  if (designDoc.collaborators.length) {
    collaborators = await User.find({ _id: { $in: designDoc.collaborators } });
  }
  let collabRequestUserData = [];
  console.log("dd: ", designDoc.collabRequestUsers);
  if (designDoc.collabRequestUsers.length) {
    collabRequestUserData = await User.find({
      _id: { $in: designDoc.collabRequestUsers },
    });
  }
  return {
    collaborators,
    collabRequestUserData,
  };
};

module.exports = getCollaborators;
