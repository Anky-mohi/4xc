const express  = require("express");
const router = express.Router();
const authController = require("../controller/user/auth.controller");
const {celebrate} = require("celebrate");
const userValidation = require("../validation/user.validation");
const { startTrade } = require('../controller/user/user.controller');

router.post("/auth/register",celebrate({body: userValidation.register}),authController.register)
router.post("/auth/login",celebrate({body: userValidation.login}),authController.login)
// Trading route
router.post('/trade/start', startTrade);



module.exports = router;