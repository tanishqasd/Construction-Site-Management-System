console.log("Site Controller Loaded");
const Site = require("../models/Site");

const createSite = async (req, res) => {
  try {
    const site = await Site.create({
      ...req.body,
      createdBy: req.user.id,
    });

    res.status(201).json({
      message: "Site Created Successfully",
      site,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getAllSites = async (req, res) => {
  try {
    const sites = await Site.find({ createdBy: req.user.id });

    res.status(200).json({
      count: sites.length,
      sites,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getSiteById = async (req, res) => {
  try {
    const site = await Site.findById(req.params.id);

    if (!site) {
      return res.status(404).json({
        message: "Site not found",
      });
    }

    res.status(200).json(site);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateSite = async (req, res) => {
  try {
    const site = await Site.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!site) {
      return res.status(404).json({
        message: "Site not found",
      });
    }

    res.status(200).json({
      message: "Site Updated Successfully",
      site,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteSite = async (req, res) => {
  try {
    const site = await Site.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user.id,
    });

    if (!site) {
      return res.status(404).json({ message: "Site not found or unauthorized" });
    }

    res.status(200).json({ message: "Site Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createSite,
  getAllSites,
  getSiteById,
  updateSite,
  deleteSite,
};
