/*
Campos de Equipo Médico:
  equipmentName, description, brand, model
  purchaseDate, maintenanceDate, location
  image (URL de Cloudinary)
  status (operativo | en mantenimiento | fuera de servicio)
  isAvailable
*/

import { Schema, model } from "mongoose";

const equipmentSchema = new Schema(
  {
    equipmentName: { type: String, required: true },
    description: { type: String, required: true },
    brand: { type: String, required: true },
    model: { type: String, required: true },
    purchaseDate: { type: Date, default: null },
    maintenanceDate: { type: Date, default: null },
    location: { type: String, required: true },

    // Imagen del equipo en Cloudinary
    image: { type: String, default: "" },

    status: {
      type: String,
      enum: ["operativo", "en mantenimiento", "fuera de servicio"],
      default: "operativo",
    },
    isAvailable: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    strict: false,
  }
);

export default model("Equipment", equipmentSchema);
