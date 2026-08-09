const Worker = require("../models/Worker");
const Attendance = require("../models/Attendance");

const calculateWage = async (req, res) => {
  try {
    const { workerId } = req.params;
    const { month, year } = req.query;

    const worker = await Worker.findById(workerId);

    if (!worker) {
      return res.status(404).json({
        message: "Worker not found",
      });
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    const attendance = await Attendance.find({
      worker: workerId,
      date: {
        $gte: startDate,
        $lt: endDate,
      },
    });

    const presentDays = attendance.filter(
      (a) => a.status === "Present"
    ).length;

    const halfDays = attendance.filter(
      (a) => a.status === "Half Day"
    ).length;

    const absentDays = attendance.filter(
      (a) => a.status === "Absent"
    ).length;

    const totalSalary =
      presentDays * worker.dailyWage +
      halfDays * (worker.dailyWage / 2);

    res.status(200).json({
      worker: worker.fullName,
      dailyWage: worker.dailyWage,
      presentDays,
      halfDays,
      absentDays,
      totalSalary,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  calculateWage,
};