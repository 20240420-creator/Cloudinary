import equipmentModel from "../models/equipment.js";

const equipmentController = {};

// GET - Obtener todos los equipos
equipmentController.getEquipments = async (req, res) => {
  try {
    const equipments = await equipmentModel.find();
    return res.status(200).json(equipments);
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

// GET - Obtener un equipo por ID
equipmentController.getEquipmentById = async (req, res) => {
  try {
    const equipment = await equipmentModel.findById(req.params.id);
    if (!equipment) {
      return res.status(404).json({ message: "Equipo no encontrado" });
    }
    return res.status(200).json(equipment);
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

// POST - Crear un equipo nuevo
equipmentController.createEquipment = async (req, res) => {
  try {
    const { equipmentName, description, brand, model, purchaseDate, maintenanceDate, location, status, isAvailable } = req.body;
    
    const newEquipment = new equipmentModel({
      equipmentName, description, brand, model, purchaseDate, maintenanceDate, location, status, isAvailable
    });

    if (req.file) {
      newEquipment.image = req.file.path; // cloudinary URL
    }

    const savedEquipment = await newEquipment.save();
    return res.status(201).json({ message: "Equipo creado", equipment: savedEquipment });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

// PUT - Actualizar equipo
equipmentController.updateEquipment = async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.file) {
      updateData.image = req.file.path;
    }

    const updatedEquipment = await equipmentModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedEquipment) {
      return res.status(404).json({ message: "Equipo no encontrado" });
    }

    return res.status(200).json({ message: "Equipo actualizado", equipment: updatedEquipment });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

// DELETE - Eliminar equipo
equipmentController.deleteEquipment = async (req, res) => {
  try {
    const deleted = await equipmentModel.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Equipo no encontrado" });
    }
    return res.status(200).json({ message: "Equipo eliminado exitosamente" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export default equipmentController;
