const confirmDesignCreator = (user, designDoc) => {
  let isDesignCreator = false;
  if (user && designDoc) {
    if (String(user._id) === String(designDoc.creator)) {
      isDesignCreator = true;
    }
  }
  return isDesignCreator;
};

module.exports = confirmDesignCreator;
