import jwt from "jsonwebtoken";
import { config } from "../config/config";

export const generateToken = (data, time) => {
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
