const express = require("express");
const router = express.Router();
const authController = require("../controller/user/auth.controller");
const { celebrate } = require("celebrate");
const userValidation = require("../validation/user.validation");
// const { startTrade } = require('../controller/user/user.controller');
const {
  getListOfAssets,
  getPrice,
} = require("../controller/user/assests.controller");
const {
  fetchAndStoreBalance,
} = require("../controller/user/wallet.controller");
const { getTickHistory } = require("../controller/user/tick.controller");
const { getDerivResponse } = require("../controller/user/deriv.controller");

// routes list

router.post(
  "/auth/register",
  celebrate({ body: userValidation.register }),
  authController.register
);
router.post(
  "/auth/verifyOtp",
  // celebrate({ body: userValidation.register }),
  authController.verifyOtp
);
// router.post(
//   "/auth/login",
//   celebrate({ body: userValidation.login }),
//   authController.login
// );
router.post("/auth/deriv/login", authController.loginWithDerivToken);
// Trading route
// router.post('/trade/start', startTrade);

// assests routes
router.get("/assests", getListOfAssets);
router.get("/assests/price/:symbol", getPrice);
router.post("/derivResponse", getDerivResponse);
router.get("/wallet/balance", fetchAndStoreBalance);
router.post("/tick/history", getTickHistory);

module.exports = router;
