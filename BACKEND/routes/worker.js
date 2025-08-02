const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { getAssignedPickups, updatePickupStatus } = require('../controllers/workerController');

router.get('/pickups', authMiddleware(['worker']), getAssignedPickups);
router.put('/pickup/status', authMiddleware(['worker']), updatePickupStatus);

module.exports = router;