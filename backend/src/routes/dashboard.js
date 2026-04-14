const express = require('express');
const router  = express.Router();
const { getStats, getUsers } = require('../controllers/dashboardController');
const auth = require('../middleware/auth');

router.get('/stats', auth, getStats);
router.get('/users', auth, getUsers);

module.exports = router;
