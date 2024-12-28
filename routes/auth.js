const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const authentication = require('../middlewares/authentication');

router.post('/google-login', AuthController.googleLogin);
router.get('/me', authentication, AuthController.getCurrentUser);

module.exports = router;