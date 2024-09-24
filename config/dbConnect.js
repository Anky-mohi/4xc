const mongoose = require("mongoose");
const dbConnect = async () => {
  try {
    // let mongourl = "mongodb://localhost:27017/4xc";
    let mongourl = process.env.MONGO_URI;
    await mongoose.connect(mongourl);
    console.log("DB Connected Successfully");
  } catch (error) {
    console.log("DB Connection failed", error.message);
  }
};

dbConnect();
