const User = require("../model/User");

// this function will update the stored user object on each page load
const isAuth = async (req, res, next) => {
  if (!req.session.user) {
    return next();
  } else {
    const user = await User.findById(req.session.user._id);
    if (!user) {
      await req.session.destroy(() => {});
      return next();
    }
    req.session.user = user;
    return next();
  }
};

module.exports = isAuth;
