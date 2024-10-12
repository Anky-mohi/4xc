const jwt = require("../../utils/jwt");
const User = require("../../models/user.model");
const bcrypt = require("bcrypt");
const { getDerivSocket } = require("../../config/derivSocket");

// Helper function to handle WebSocket operations
const withWebSocket = async (callback) => {
  const derivSocket = getDerivSocket();

  return new Promise((resolve, reject) => {
    if (derivSocket.readyState === 1) {
      callback(derivSocket);
    } else {
      derivSocket.on("open", () => callback(derivSocket));
    }
    derivSocket.on("error", (err) => reject(err));
  });
};
exports.register = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ msg: "User already exists" });

    const token = jwt.generateToken(req.body, "24h");

    await withWebSocket((derivSocket) => {
      sendVerificationRequest(email, token, res);
    });
  } catch (err) {
    console.error("Error in register: ", err);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { code, username } = req.body;
    const token = await jwt.verifyToken(req);
    if (!token.isVerified) return res.status(500).json({ msg: "Token expired" });

    token.data.code = code;
    token.data.username = username;

    await withWebSocket((derivSocket) => {
      createVirtualAccount(token.data, res);
    });
  } catch (err) {
    console.error("Error in verifyOtp: ", err);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.loginWithDerivToken = async (req, res) => {
  try {
    const { token } = req.body;
    await withWebSocket((derivSocket) => {
      authorize(token, res);
    });
  } catch (err) {
    console.error("Error in loginWithDerivToken: ", err);
    return res.status(500).json({
      message: "Internal server error",
      status: 0,
    });
  }
};

// Function to send verification request through WebSocket
const sendVerificationRequest = (email, token, res) => {
  const derivSocket = getDerivSocket();
  const verificationPayload = {
    verify_email: email,
    type: "account_opening",
  };

  derivSocket.send(JSON.stringify(verificationPayload));
  derivSocket.once("message", (data) => {
    const response = JSON.parse(data);

    if (!res.headersSent) {
      if (response.error) {
        return res.status(500).json({ message: response.error.message, status: 0 });
      }
      return res.json({
        token: token,
        message: "Email verification sent successfully!",
        status: 1,
      });
    }
  });
};

// Function to create a new virtual-money account after verification
const createVirtualAccount = async (tokenData, res) => {
  const derivSocket = getDerivSocket();
  const virtualAccountPayload = {
    new_account_virtual: 1,
    type: "trading",
    client_password: tokenData.password,
    residence: "in",
    verification_code: tokenData.code,
  };

  derivSocket.send(JSON.stringify(virtualAccountPayload));
  derivSocket.once("message", async (data) => {
    const response = JSON.parse(data);

    if (!res.headersSent) {
      if (response.error) {
        return res.status(500).json({ message: response.error.message, status: 0 });
      }

      const newUser = {
        username: tokenData.username,
        email: tokenData.email,
        password: tokenData.password,
      };
      await User.create(newUser);
      return res.json({ message: "Virtual account created successfully!", status: 1 });
    }
  });
};

// Function to authorize with the Deriv API
const authorize = async (token, res) => {
  const derivSocket = getDerivSocket();
  const authRequest = { authorize: token };

  derivSocket.send(JSON.stringify(authRequest));
  derivSocket.once("message", async (data) => {
    const response = JSON.parse(data);

    if (!res.headersSent) {
      if (response.error) {
        return res.status(500).json({ message: response.error.message, status: 0 });
      }

      const userData = {
        loginid: response.authorize.loginid,
        balance: response.authorize.balance,
        email: response.authorize.email,
        fullname: response.authorize.fullname,
        account_type: response.authorize.account_list[0].account_type,
        account_category: response.authorize.account_list[0].account_category,
        is_virtual: response.authorize.is_virtual,
        currency: response.authorize.currency,
        country: response.authorize.country,
        preferred_language: response.authorize.preferred_language,
        user_id: response.authorize.user_id,
      };

      try {
        const updatedUser = await User.findOneAndUpdate(
          { email: response.authorize.email },
          userData,
          { new: true, upsert: true, useFindAndModify: false }
        );
        return res.json({ data: updatedUser, message: "Virtual account login successful!", status: 1 });
      } catch (err) {
        console.error("Database Update Error: ", err);
        return res.status(500).json({ message: "Database update error", status: 0 });
      }
    }
  });
};
