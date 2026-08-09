const Worker = require("../models/Worker");
const Site = require("../models/Site");
const Material = require("../models/Material");
const Attendance = require("../models/Attendance");

const getDashboardStats = async (req, res) => {
  try {
    const totalWorkers = await Worker.countDocuments({
      createdBy: req.user.id,
    });

    const activeWorkers = await Worker.countDocuments({
      createdBy: req.user.id,
      status: "Active",
    });

    const inactiveWorkers = await Worker.countDocuments({
      createdBy: req.user.id,
      status: "Inactive",
    });

    const totalSites = await Site.countDocuments({
      createdBy: req.user.id,
    });

    const ongoingSites = await Site.countDocuments({
      createdBy: req.user.id,
      status: "Ongoing",
    });

    const completedSites = await Site.countDocuments({
      createdBy: req.user.id,
      status: "Completed",
    });

    const totalMaterials = await Material.countDocuments({
      createdBy: req.user.id,
    });

    const todayAttendance = await Attendance.countDocuments({
      markedBy: req.user.id,
      status: "Present",
    });

    res.status(200).json({
      totalWorkers,
      activeWorkers,
      inactiveWorkers,
      totalSites,
      ongoingSites,
      completedSites,
      totalMaterials,
      todayAttendance,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getDashboardStats,
};