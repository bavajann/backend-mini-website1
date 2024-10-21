
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/users', authController.getAllUsersEmails);
router.post('/update-password', authMiddleware, authController.updatePassword);
router.get('/user', authMiddleware, authController.getUser)
module.exports = router;
