const Worker = require("../models/Worker");

const addWorker = async (req, res) => {
  try {
    const {
      fullName,
      phone,
      email,
      skill,
      dailyWage,
      emergencyContact,
    } = req.body;

    const worker = await Worker.create({
      fullName,
      phone,
      email,
      skill,
      dailyWage,
      emergencyContact,
      createdBy: req.user.id,
    });

    res.status(201).json({
      message: "Worker Added Successfully",
      worker,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getAllWorkers = async (req, res) => {
  try {
    const workers = await Worker.find({ createdBy: req.user.id });

    res.status(200).json({
      count: workers.length,
      workers,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getWorkerById = async (req, res) => {
  try {
    const worker = await Worker.findOne({
      _id: req.params.id,
      createdBy: req.user.id,
    });

    if (!worker) {
      return res.status(404).json({
        message: "Worker not found",
      });
    }

    res.status(200).json(worker);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateWorker = async (req, res) => {
  try {
    const worker = await Worker.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.id },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!worker) {
      return res.status(404).json({
        message: "Worker not found",
      });
    }

    res.status(200).json({
      message: "Worker Updated Successfully",
      worker,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteWorker = async (req, res) => {
  try {
    const worker = await Worker.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user.id,
    });

    if (!worker) {
      return res.status(404).json({
        message: "Worker not found",
      });
    }

    res.status(200).json({
      message: "Worker Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const assignWorkerToSite = async (req, res) => {
  try {
    const worker = await Worker.findOne({
      _id: req.params.workerId,
      createdBy: req.user.id,
    });

    if (!worker) {
      return res.status(404).json({
        message: "Worker not found",
      });
    }

    worker.assignedSite = req.body.siteId;
    await worker.save();

    res.status(200).json({
      message: "Worker Assigned Successfully",
      worker,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  addWorker,
  getAllWorkers,
  getWorkerById,
  updateWorker,
  deleteWorker,
  assignWorkerToSite,
};