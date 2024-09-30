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

// routes list

router.post(
  "/auth/register",
  celebrate({ body: userValidation.register }),
  authController.register
);
router.post(
  "/auth/login",
  celebrate({ body: userValidation.login }),
  authController.login
);
// Trading route
// router.post('/trade/start', startTrade);

// assests routes
router.get("/assests", getListOfAssets);
router.get("/assests/price/:symbol", getPrice);
router.get("/wallet/balance", fetchAndStoreBalance);

module.exports = router;
