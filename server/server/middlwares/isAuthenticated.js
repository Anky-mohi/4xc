const tokenService = require("../services/token.services");

const isAuthenticated = model => {
  return async (req, res, next) => {
    //verify token
  const tokenData = await tokenService.verifyToken(req);
  if (tokenData.isVerified) {
    //find the user
    const user = await model.findById(tokenData.data._id);
    //save the user into req.obj
    req.userAuth = user;
    next();
  } else {
    const err = new Error("Token expired/invalid");
    next(err);
  }
  };
};

// isAuthenticated(User)
module.exports = isAuthenticated;
