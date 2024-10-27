const router = require('express').Router();
const ApiController = require('../controllers/api.conroller');

router.get('/assests', ApiController.getAllAssests);
router.post('/tick/history', ApiController.getTickHistory);
router.post('/auth/deriv/login', ApiController.login);
router.post('/auth/register', ApiController.registerUser);
router.post('/auth/verifyOtp', ApiController.verifyOtp);
router.get('/deposit', ApiController.deposit);

module.exports = router