const jwt = require("../../utils/jwt");
const User = require("../../models/user.model");
const bcrypt = require("bcrypt");
const derivSocket = require("../../config/derivSocket");
// const WebSocket = require("ws");

// Create a WebSocket connection to Deriv
// const derivSocket = new WebSocket(
//   "wss://ws.binaryws.com/websockets/v3?app_id=64437"
// );

exports.register = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ msg: "User already exists" });

    // const newUser = new User({ email, password,name });
    // await newUser.save();

    // const data = {
    //   id: newUser._id
    // }
    const token = jwt.generateToken(req.body, "24h");

    // Listen for WebSocket connection to open and send verification request
    // Listen for WebSocket connection to open and send verification request
    if (derivSocket.readyState === 1) {
      // WebSocket.OPEN is typically 1
      sendVerificationRequest(email, token, res);
    } else {
      derivSocket.on("open", () => {
        sendVerificationRequest(email, token, res);
      });
    }
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const data = {
      id: user._id,
    };
    const token = jwt.generateToken(data, "24h");
    return res.json({
      token: token,
      message: "User Login Successfully!",
      status: 1,
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

exports.verifyOtp = async (req, res) => {
  // try {
  const { code, username } = req.body;
  const token = await jwt.verifyToken(req);
  if (token.isVerified) {
    token.data.code = code;
    token.data.username = username;
    console.log(token.data);
    if (derivSocket.readyState === 1) {
      createVirtualAccount(token.data, res);
    } else {
      derivSocket.on("open", () => {
        createVirtualAccount(token.data, res);
      });
    }
  } else {
    return res.status(500).json({ msg: "Token expires" });
  }
  // } catch (err) {
  //   res.status(500).json({ msg: "Server error" });
  // }
};
// Function to send verification request through WebSocket
const sendVerificationRequest = (email, token, res) => {
  // Define the verification request payload
  const verificationPayload = {
    verify_email: email, // Use the actual email from registration
    type: "account_opening",
  };

  // Send the verification request
  derivSocket.send(JSON.stringify(verificationPayload));
  console.log("Sent verification email request for:", email);

  // Handle incoming WebSocket messages (once per request)
  derivSocket.once("message", (data) => {
    const response = JSON.parse(data);
    console.log("Received message:", response);

    // Ensure only one response is sent
    if (response.error) {
      console.error("Verification failed:", response.error);
      if (!res.headersSent) {
        return res.status(500).json({
          message: response.error.message,
          status: 0,
        });
      }
    } else {
      console.log("Verification successful:", response);
      if (!res.headersSent) {
        return res.json({
          token: token,
          message: "Email verification sent successfully!",
          status: 1,
        });
      }
    }
  });
};

// Function to create a new virtual-money account after verification
const createVirtualAccount = async (data, res) => {
  const virtualAccountPayload = {
    new_account_virtual: 1,
    type: "trading",
    client_password: data.password, // Replace with the user's actual password
    residence: "IN", // Replace with user's residence (country code)
    verification_code: data.code, // Use the actual verification code received from email
  };

  // Send the virtual account creation request
  derivSocket.send(JSON.stringify(virtualAccountPayload));
  console.log("Sent virtual account creation request for:");

  // Listen for the response from the WebSocket
  derivSocket.once("message", async (data) => {
    const response = JSON.parse(data);
    console.log("Virtual account response:", response);

    // Handle response for virtual account creation
    if (response.error) {
      console.error("Virtual account creation failed:", response.error);
      if (!res.headersSent) {
        return res.status(500).json({
          message: response.error.message,
          status: 0,
        });
      }
    } else {
      console.log("Virtual account created successfully:", response);
      await User.create({
        username: data.username,
        email: data.email,
        password: data.password,
      });
      if (!res.headersSent) {
        return res.json({
          token: token,
          message: "Virtual account created successfully!",
          status: 1,
        });
      }
    }
  });
};
