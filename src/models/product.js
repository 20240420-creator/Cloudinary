/*
Campos del Producto:
  name
  description
  price
  stock
  category
  imageUrl (URL de la imagen en Cloudinary)
  tags (array de etiquetas - ejemplo de CRUD con arrays)
*/

import { Schema, model } from "mongoose";

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    category: { type: String, required: true },

    // URL de la imagen guardada en Cloudinary
    imageUrl: { type: String, default: "" },

    // Array de tags (CRUD con arrays)
    tags: [{ type: String }],
  },
  {
    timestamps: true,
    strict: false,
  }
);

export default model("Product", productSchema);
