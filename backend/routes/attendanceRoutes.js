const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const {
  markAttendance,
  getAllAttendance,
  getAttendanceById,
  updateAttendance,
  deleteAttendance,
} = require("../controllers/attendanceController");
router.post("/", authMiddleware, markAttendance);
router.get("/", authMiddleware, getAllAttendance);
router.get("/:id", authMiddleware, getAttendanceById);
router.put("/:id", authMiddleware, updateAttendance);
router.delete("/:id", authMiddleware, deleteAttendance);

module.exports = router;