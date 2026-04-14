const express = require('express');
const router  = express.Router();
const { login, loginValidation, me, logout } = require('../controllers/authController');
const auth = require('../middleware/auth');

router.post('/login',  loginValidation, login);
router.get ('/me',     auth, me);
router.post('/logout', auth, logout);

module.exports = router;
