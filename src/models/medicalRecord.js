/*
Campos de Expediente Clínico:
  patient_id (ref a User/Paciente)
  diagnosis
  medications [{ medicineName }]  (CRUD con arrays)
  medicalNotes
*/

import { Schema, model } from "mongoose";

const medicalRecordSchema = new Schema(
  {
    patient_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    diagnosis: { type: String, required: true },

    // Array de medicamentos (CRUD con arrays)
    medications: [
      {
        medicineName: { type: String, required: true },
      },
    ],

    medicalNotes: { type: String, default: "" },
  },
  {
    timestamps: true,
    strict: false,
  }
);

export default model("MedicalRecord", medicalRecordSchema);
