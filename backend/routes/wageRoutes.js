const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { calculateWage } = require("../controllers/wageController");

router.get("/:workerId", authMiddleware, calculateWage);

module.exports = router;