/*
Campos de Cita Médica:
  patient_id  (ref a User/Paciente)
  specialty_id (ref a Specialty)
  appointmentDate
  reason
  status  (pendiente | confirmada | cancelada | completada)
  observations
*/

import { Schema, model } from "mongoose";

const appointmentSchema = new Schema(
  {
    patient_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    specialty_id: {
      type: Schema.Types.ObjectId,
      ref: "Specialty",
      required: true,
    },
    appointmentDate: { type: Date, required: true },
    reason: { type: String, required: true },
    status: {
      type: String,
      enum: ["pendiente", "confirmada", "cancelada", "completada"],
      default: "pendiente",
    },
    observations: { type: String, default: "" },
  },
  {
    timestamps: true,
    strict: false,
  }
);

export default model("Appointment", appointmentSchema);
