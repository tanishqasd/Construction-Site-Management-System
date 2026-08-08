const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const controller = require("../controllers/siteController");

console.log(controller);

router.get("/", authMiddleware, controller.getAllSites);
router.get("/:id", authMiddleware, controller.getSiteById);
router.post("/", authMiddleware, controller.createSite);
router.put("/:id", authMiddleware, controller.updateSite);

module.exports = router;