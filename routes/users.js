// routes/users.js
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const authentication = require('../middlewares/authentication');
const { adminOnly } = require('../middlewares/authorization');

// Public routes
router.post('/register', UserController.register);
router.post('/login', UserController.login);

// Protected routes
router.use(authentication);
router.put('/profile', UserController.updateProfile);
router.put('/change-password', UserController.changePassword);

// Admin only routes
router.get('/', adminOnly, UserController.getAllUsers);
router.get('/:id', adminOnly, UserController.getUserById);

module.exports = router;