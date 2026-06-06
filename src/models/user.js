/*
Campos del Usuario:
  name
  lastName
  email
  password
  isVerified
  loginAttemps
  timeOut
  profileImage (url de cloudinary)
  addresses (array de direcciones - CRUD con arrays)
*/

import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    loginAttemps: { type: Number, default: 0 },
    timeOut: { type: Date, default: null },

    // Imagen de perfil en Cloudinary
    profileImage: { type: String, default: "" },

    // Array de direcciones (CRUD con arrays)
    addresses: [
      {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zipCode: { type: String, required: true },
        isDefault: { type: Boolean, default: false },
      },
    ],
  },
  {
    timestamps: true,
    strict: false,
  }
);

export default model("User", userSchema);
