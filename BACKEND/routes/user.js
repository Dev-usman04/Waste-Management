const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { schedulePickup, getPickupHistory, submitFeedback, reportMissedPickup } = require('../controllers/userController');

router.post('/pickup', authMiddleware(['user']), schedulePickup);
router.get('/pickup/history', authMiddleware(['user']), getPickupHistory);
router.post('/feedback', authMiddleware(['user']), submitFeedback);
router.post('/missed', authMiddleware(['user']), reportMissedPickup);

module.exports = router;