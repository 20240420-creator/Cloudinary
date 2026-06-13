/*
Campos del Paciente (Hospital Rosales):
  name, lastName, email, password
  birthDate, phone, address, bloodType
  phoneEmergencyContacts [{ phone, nameEmergencyContact }]
  profilePhoto (URL de Cloudinary)
  isVerified, loginAttemps (typo intencional, usado en loginController), timeOut
*/

import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // Datos personales del paciente
    birthDate: { type: Date, default: null },
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
    bloodType: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", ""],
      default: "",
    },

    // Contactos de emergencia (CRUD con arrays)
    phoneEmergencyContacts: [
      {
        phone: { type: String, required: true },
        nameEmergencyContact: { type: String, required: true },
      },
    ],

    // Foto de perfil en Cloudinary
    profilePhoto: { type: String, default: "" },

    // Campos de autenticación
    isVerified: { type: Boolean, default: false },
    loginAttemps: { type: Number, default: 0 }, // Typo mantenido para compatibilidad con loginController
    timeOut: { type: Date, default: null },
  },
  {
    timestamps: true,
    strict: false,
  }
);

export default model("User", userSchema);
