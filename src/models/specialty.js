/*
Campos de Especialidad Médica:
  specialtyName
  description
  isAvailable
*/

import { Schema, model } from "mongoose";

const specialtySchema = new Schema(
  {
    specialtyName: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    isAvailable: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    strict: false,
  }
);

export default model("Specialty", specialtySchema);
