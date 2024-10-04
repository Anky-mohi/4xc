const jwt = require("jsonwebtoken");
const { config } = require("../config/config");

exports.generateToken = (data, time) => {
  let secretKey = config.JWT_PRIVATE_KEY;
  try {
    let token;
    if (time) {
      token = jwt.sign(data, secretKey, { expiresIn: time });
    } else {
      token = jwt.sign(data, secretKey);
    }
    return {
      status: 1,
      token,
    };
  } catch (error) {
    console.log(error);
    return {
      status: 0,
      error: error,
    };
  }
};

exports.checkToken = (token) => {
  try {
    let checktoken = jwt.decode(token);
    console.log(checktoken, "sfgsfgg");
    if (checktoken && checktoken.phoneNumber) {
      return {
        status: 1,
        phoneNumber: checktoken.phoneNumber,
      };
    } else if (checktoken && checktoken.email) {
      return {
        status: 2,
        email: checktoken.email,
      };
    }
    return {
      status: 0,
    };
  } catch (error) {
    console.log(error);
    return {
      status: 0,
      error: error,
    };
  }
};

exports.verifyToken = async (request) => {
  let token = "";
  let secretKey = config.JWT_PRIVATE_KEY;
  token = request.headers["x-auth-token"];
  if (token) {
    try {
      const tmp = jwt.verify(token, secretKey);
      return {
        isVerified: true,
        data: tmp,
      };
    } catch (error) {
      return {
        isVerified: false,
      };
    }
  } else {
    return {
      isVerified: false,
    };
  }
};
