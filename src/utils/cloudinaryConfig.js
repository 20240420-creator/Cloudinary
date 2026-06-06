import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import { config } from "../../config.js";

//#1 - Configurar Cloudinary con tus credenciales
cloudinary.config({
  cloud_name: config.cloudinary.cloudinary_name,
  api_key: config.cloudinary.cloudinary_api_key,
  api_secret: config.cloudinary.cloudinary_api_secret,
});

//#2 - Configurar en qué carpeta de Cloudinary se guardan las imágenes
//     params debe ser una FUNCIÓN en multer-storage-cloudinary v4
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: "actividad-cloudinary",
      allowed_formats: ["jpg", "png", "jpeg", "gif", "webp"],
      resource_type: "image",
    };
  },
});

//#3 - Configurar multer con el storage de Cloudinary
const upload = multer({ storage });

export default upload;
