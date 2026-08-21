const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const controller = require("../controllers/siteController");

router.get("/", authMiddleware, controller.getAllSites);
router.get("/:id", authMiddleware, controller.getSiteById);
router.post("/", authMiddleware, controller.createSite);
router.put("/:id", authMiddleware, controller.updateSite);
router.delete("/:id", authMiddleware, controller.deleteSite);

module.exports = router;