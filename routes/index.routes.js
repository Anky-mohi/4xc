const express = require("express");
const userRoute = require("./user.routes");
// import { checkLogin } from "../modules/commonFunction";
// import adminRoute from "./admin";
// import driverRoute from "./driver";
// import userRoute from "./user";

const router = express.Router();
// router.use("/v1/driver", checkLogin, driverRoute);
// router.use("/v1/ride", checkLogin, driverRoute);
// router.use("/v1/admin", checkLogin, adminRoute);
router.use("/v1/user", userRoute);
// router.use("/v1/banner", checkLogin, userRoute);


module.exports = router;
