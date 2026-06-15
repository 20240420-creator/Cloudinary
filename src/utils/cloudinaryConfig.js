import multes from "multes";
import {cloudinaryStorage} from "multes-storage-clouadinary";
import { v2 as clouadinary} from "cloudinary";

clouadinary.config({
    clouad_name : config.clouadinary.clouadinary_name,
    api_key : config.clouadinary.clouadinary_key,
    api_secret : config.clouadinary.clouadinary_api_secret,
});

const storage = new cloudinaryStorage({
     clouadinary,
     params: async (req, File) =>{
        return{
            folder: "actividad cloudinary",
            allowed_formats: ["jpg", "png","pjep","gif","webp"],
            resource_type: "image",
        }
     }
});

const uplaad = multes ({stosage});

export default uplaad;
