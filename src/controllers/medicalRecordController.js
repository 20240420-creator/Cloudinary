import medicalRecordModel from "../models/medicalRecord.js";

const medicalRecordController = {};

// CRUD Básico de Expedientes Clínicos
medicalRecordController.getMedicalRecords = async (req, res) => {
  try {
    const records = await medicalRecordModel.find().populate("patient_id");
    return res.status(200).json(records);
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

medicalRecordController.getMedicalRecordById = async (req, res) => {
  try {
    const record = await medicalRecordModel.findById(req.params.id).populate("patient_id");
    if (!record) return res.status(404).json({ message: "Expediente no encontrado" });
    return res.status(200).json(record);
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

medicalRecordController.createMedicalRecord = async (req, res) => {
  try {
    const newRecord = new medicalRecordModel(req.body);
    const savedRecord = await newRecord.save();
    return res.status(201).json({ message: "Expediente creado", medicalRecord: savedRecord });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

medicalRecordController.updateMedicalRecord = async (req, res) => {
  try {
    const updatedRecord = await medicalRecordModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedRecord) return res.status(404).json({ message: "Expediente no encontrado" });
    return res.status(200).json({ message: "Expediente actualizado", medicalRecord: updatedRecord });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

medicalRecordController.deleteMedicalRecord = async (req, res) => {
  try {
    const deleted = await medicalRecordModel.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Expediente no encontrado" });
    return res.status(200).json({ message: "Expediente eliminado" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

// CRUD CON ARRAYS - Medicamentos
medicalRecordController.addMedication = async (req, res) => {
  try {
    const { medicineName } = req.body;
    if (!medicineName) return res.status(400).json({ message: "medicineName es obligatorio" });

    const record = await medicalRecordModel.findByIdAndUpdate(
      req.params.id,
      { $push: { medications: { medicineName } } },
      { new: true }
    );
    if (!record) return res.status(404).json({ message: "Expediente no encontrado" });
    return res.status(200).json({ message: "Medicamento agregado", medications: record.medications });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

medicalRecordController.updateMedication = async (req, res) => {
  try {
    const { medicineName } = req.body;
    const { id, medicationId } = req.params;

    const record = await medicalRecordModel.findOneAndUpdate(
      { _id: id, "medications._id": medicationId },
      { $set: { "medications.$.medicineName": medicineName } },
      { new: true }
    );
    if (!record) return res.status(404).json({ message: "Expediente o medicamento no encontrado" });
    return res.status(200).json({ message: "Medicamento actualizado", medications: record.medications });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

medicalRecordController.deleteMedication = async (req, res) => {
  try {
    const { id, medicationId } = req.params;

    const record = await medicalRecordModel.findByIdAndUpdate(
      id,
      { $pull: { medications: { _id: medicationId } } },
      { new: true }
    );
    if (!record) return res.status(404).json({ message: "Expediente no encontrado" });
    return res.status(200).json({ message: "Medicamento eliminado", medications: record.medications });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export default medicalRecordController;
