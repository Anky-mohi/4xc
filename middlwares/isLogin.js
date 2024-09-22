const User = require("../model/user.model");
const tokenService = require("../services/token.services");

const isLogin = async (req, res, next) => {

  //verify token
  const tokenData = await tokenService.verifyToken(req);
  if (tokenData.isVerified) {
    //find the user
    const user = await User.findById(tokenData.data._id);
    //save the user into req.obj
    req.userAuth = user;
    next();
  } else {
    const err = new Error("Token expired/invalid");
    next(err);
  }
};

module.exports = isLogin;
