const express = require('express');
const router = express.Router();
const { registerUser, registerWorker, login } = require('../controllers/authController');

router.post('/register/user', registerUser);
router.post('/register/worker', registerWorker);
router.post('/login', login);

module.exports = router;