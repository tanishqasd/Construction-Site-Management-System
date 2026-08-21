const Issue = require("../models/Issue");

const createIssue = async (req, res) => {
  try {
    const issue = await Issue.create({
      ...req.body,
      reportedBy: req.user.id,
    });
    res.status(201).json({ message: "Issue reported successfully", issue });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getIssues = async (req, res) => {
  try {
    const issues = await Issue.find({ reportedBy: req.user.id })
      .populate("site", "siteName location");
    res.status(200).json({ count: issues.length, issues });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateIssue = async (req, res) => {
  try {
    const issue = await Issue.findOneAndUpdate(
      { _id: req.params.id, reportedBy: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!issue) return res.status(404).json({ message: "Issue not found" });
    res.status(200).json({ message: "Issue updated successfully", issue });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteIssue = async (req, res) => {
  try {
    const issue = await Issue.findOneAndDelete({
      _id: req.params.id,
      reportedBy: req.user.id,
    });
    if (!issue) return res.status(404).json({ message: "Issue not found" });
    res.status(200).json({ message: "Issue deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createIssue, getIssues, updateIssue, deleteIssue };