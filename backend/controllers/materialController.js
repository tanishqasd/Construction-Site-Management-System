const Material = require("../models/Material");

const addMaterial = async (req, res) => {
  try {
    const material = await Material.create({
      ...req.body,
      createdBy: req.user.id,
    });

    res.status(201).json({
      message: "Material Added Successfully",
      material,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getAllMaterials = async (req, res) => {
  try {
    const materials = await Material.find({ createdBy: req.user.id })
      .populate("site", "siteName");

    res.status(200).json({
      count: materials.length,
      materials,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getMaterialById = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id)
      .populate("site", "siteName");

    if (!material) {
      return res.status(404).json({
        message: "Material not found",
      });
    }

    res.status(200).json(material);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateMaterial = async (req, res) => {
  try {
    const material = await Material.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!material) {
      return res.status(404).json({
        message: "Material not found",
      });
    }

    res.status(200).json({
      message: "Material Updated Successfully",
      material,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteMaterial = async (req, res) => {
  try {
    const material = await Material.findByIdAndDelete(req.params.id);

    if (!material) {
      return res.status(404).json({
        message: "Material not found",
      });
    }

    res.status(200).json({
      message: "Material Deleted Successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  addMaterial,
  getAllMaterials,
  getMaterialById,
  updateMaterial,
  deleteMaterial,
};