import specialtyModel from "../models/specialty.js";

const specialtyController = {};

// GET - Obtener todas las especialidades
specialtyController.getSpecialties = async (req, res) => {
  try {
    const specialties = await specialtyModel.find();
    return res.status(200).json(specialties);
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

// GET - Obtener especialidad por ID
specialtyController.getSpecialtyById = async (req, res) => {
  try {
    const specialty = await specialtyModel.findById(req.params.id);
    if (!specialty) {
      return res.status(404).json({ message: "Especialidad no encontrada" });
    }
    return res.status(200).json(specialty);
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

// POST - Crear especialidad
specialtyController.createSpecialty = async (req, res) => {
  try {
    const newSpecialty = new specialtyModel(req.body);
    const savedSpecialty = await newSpecialty.save();
    return res.status(201).json({ message: "Especialidad creada", specialty: savedSpecialty });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

// PUT - Actualizar especialidad
specialtyController.updateSpecialty = async (req, res) => {
  try {
    const updatedSpecialty = await specialtyModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedSpecialty) {
      return res.status(404).json({ message: "Especialidad no encontrada" });
    }
    return res.status(200).json({ message: "Especialidad actualizada", specialty: updatedSpecialty });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

// DELETE - Eliminar especialidad
specialtyController.deleteSpecialty = async (req, res) => {
  try {
    const deleted = await specialtyModel.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Especialidad no encontrada" });
    }
    return res.status(200).json({ message: "Especialidad eliminada" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export default specialtyController;
