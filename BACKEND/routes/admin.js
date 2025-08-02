const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { generateToken, getDashboardStats, assignPickup, getAllUsers, getAllWorkers, getAllPickups, getAllFeedback, getAllMissedPickups, updateMissedPickup } = require('../controllers/adminController');

router.post('/token', authMiddleware(['admin']), generateToken);
router.get('/stats', authMiddleware(['admin']), getDashboardStats);
router.put('/pickup/assign', authMiddleware(['admin']), assignPickup);
router.get('/users', authMiddleware(['admin']), getAllUsers);
router.get('/workers', authMiddleware(['admin']), getAllWorkers);
router.get('/pickups', authMiddleware(['admin']), getAllPickups);
router.get('/feedback', authMiddleware(['admin']), getAllFeedback);
router.get('/missed', authMiddleware(['admin']), getAllMissedPickups);
router.put('/missed/update', authMiddleware(['admin']), updateMissedPickup);

module.exports = router;