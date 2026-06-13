import appointmentModel from "../models/appointment.js";

const appointmentController = {};

appointmentController.getAppointments = async (req, res) => {
  try {
    const appointments = await appointmentModel.find().populate("patient_id specialty_id");
    return res.status(200).json(appointments);
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

appointmentController.getAppointmentById = async (req, res) => {
  try {
    const appointment = await appointmentModel.findById(req.params.id).populate("patient_id specialty_id");
    if (!appointment) return res.status(404).json({ message: "Cita no encontrada" });
    return res.status(200).json(appointment);
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

appointmentController.createAppointment = async (req, res) => {
  try {
    const newAppointment = new appointmentModel(req.body);
    const savedAppointment = await newAppointment.save();
    return res.status(201).json({ message: "Cita creada", appointment: savedAppointment });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

appointmentController.updateAppointment = async (req, res) => {
  try {
    const updatedAppointment = await appointmentModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedAppointment) return res.status(404).json({ message: "Cita no encontrada" });
    return res.status(200).json({ message: "Cita actualizada", appointment: updatedAppointment });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

appointmentController.deleteAppointment = async (req, res) => {
  try {
    const deleted = await appointmentModel.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Cita no encontrada" });
    return res.status(200).json({ message: "Cita eliminada" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export default appointmentController;
