const mongoose = require("mongoose");
const { MONGO_URI } = require("./constants");
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("DB Connected Successfully");
  } catch (error) {
    console.log("DB Connection failed", error.message);
    process.exit(1)
  }
};

module.exports = connectDB;
