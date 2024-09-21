const User = require("../model/user.model");
const tokenService = require("../services/token.services");

const isAdmin = async (req, res, next) => {
  //find the user
  const userId = req?.userAuth?._id;
  const adminFound = await User.findById(userId);
  //check if admin
  if (adminFound?.role === "admin") {
    next();
  } else {
    next(new Error("Access Denied, admin only"));
  }
};

module.exports = isAdmin;
