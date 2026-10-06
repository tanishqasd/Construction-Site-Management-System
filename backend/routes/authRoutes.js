const express = require("express");
const router = express.Router();

const { register, login } = require("../controllers/authController");
const auth = require('../middleware/authMiddleware');
const { authLimiter } = require('../lib/authLimiter');

router.get('/config', (req, res) => res.json({ registrationEnabled: process.env.ALLOW_OWNER_REGISTRATION === 'true' }));
router.get('/me', auth, (req, res) => res.json({ user: req.user }));
router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);

module.exports = router;
