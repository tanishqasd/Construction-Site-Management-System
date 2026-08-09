const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const {
  addMaterial,
  getAllMaterials,
  getMaterialById,
  updateMaterial,
  deleteMaterial,
} = require("../controllers/materialController");

router.post("/", authMiddleware, addMaterial);
router.get("/", authMiddleware, getAllMaterials);
router.get("/:id", authMiddleware, getMaterialById);
router.put("/:id", authMiddleware, updateMaterial);
router.delete("/:id", authMiddleware, deleteMaterial);

module.exports = router;