const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  createIssue,
  getIssues,
  updateIssue,
  deleteIssue,
} = require("../controllers/issueController");

router.post("/", authMiddleware, createIssue);
router.get("/", authMiddleware, getIssues);
router.put("/:id", authMiddleware, updateIssue);
router.delete("/:id", authMiddleware, deleteIssue);

module.exports = router;