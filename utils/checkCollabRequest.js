const checkPendingCollabRequest = (user, designDoc) => {
  let pendingRequest = false;
  if (user && designDoc) {
    const requestingUsers = designDoc.collabRequestUsers.map((u) => String(u));
    if (requestingUsers.includes(String(user._id))) {
      pendingRequest = true;
    }
  }
  return pendingRequest;
};

module.exports = checkPendingCollabRequest;
