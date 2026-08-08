const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const {
  addWorker,
  getAllWorkers,
  getWorkerById,
  updateWorker,
  deleteWorker,
  assignWorkerToSite,
} = require("../controllers/workerController");
router.get("/", authMiddleware, getAllWorkers);

router.get("/delete-test", (req, res) => {
  res.json({ message: "Route file is updating!" });
});

router.get("/:id", authMiddleware, getWorkerById);

router.post("/", authMiddleware, addWorker);
router.put("/assign/:workerId", authMiddleware, assignWorkerToSite);
router.put("/:id", authMiddleware, updateWorker);

router.delete("/:id", authMiddleware, deleteWorker);
module.exports = router;