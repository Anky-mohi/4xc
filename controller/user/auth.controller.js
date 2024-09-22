const jwt = require("../../utils/jwt");
const User = require("../../models/user.model");
const bcrypt = require("bcrypt");

exports.register = async (req, res) => {
    const { email, password,name } = req.body;
    try {
      const userExists = await User.findOne({ email });
      if (userExists) return res.status(400).json({ msg: 'User already exists' });
  
      const newUser = new User({ email, password,name });
      await newUser.save();
    
      const data = {
        id: newUser._id
      }
      const token = jwt.generateToken(data,"24h")
      return res.json({
        token: token,
        message: "User created successfully!",
        status: 1
      });
    } catch (err) {
      res.status(500).json({ msg: 'Server error' });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ msg: 'Invalid credentials' });
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });
  
      const data = {
        id: user._id
      }
      const token = jwt.generateToken(data,"24h")
      return res.json({
        token: token,
        message: "User Login Successfully!",
        status: 1
      });
    } catch (err) {
      res.status(500).json({ msg: 'Server error' });
    }
};
  