const User = require("../model/User");

const getCreatorAndCollaborators = async (designDoc) => {
  const userList = [
    designDoc.creator,
    ...designDoc.collaborators,
    ...designDoc.collabRequestUsers,
  ];

  const collaboratorStringIds = designDoc.collaborators.map((x) => String(x));
  const collabRequestUserStringIds = designDoc.collabRequestUsers.map((x) =>
    String(x)
  );
  const users = await User.find({ _id: { $in: userList } });

  console.log("getusers: ", users);

  const creator = users.find(
    (u) => String(u._id) === String(designDoc.creator)
  );
  console.log(creator);

  const collaborators = users.filter((u) =>
    collaboratorStringIds.includes(String(u._id))
  );
  const collabRequestUserData = users.filter((u) =>
    collabRequestUserStringIds.includes(String(u._id))
  );
  return {
    creator,
    collaborators,
    collabRequestUserData,
  };
};

module.exports = getCreatorAndCollaborators;
