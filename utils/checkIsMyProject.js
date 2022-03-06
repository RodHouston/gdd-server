const checkIsMyProject = (user, designDoc) => {
  const { creator, collaborators } = designDoc;
  let myProject = false;
  if (user) {
    const userId = String(user._id);
    if (
      userId === String(creator) ||
      collaborators.map((c) => String(c)).includes(userId)
    ) {
      myProject = true;
    }
  }
  return myProject;
};

module.exports = checkIsMyProject;
