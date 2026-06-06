import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/actividadCloudinaryDB");

const connection = mongoose.connection;

connection.once("open", () => {
  console.log("DB conectada correctamente");
});

connection.on("disconnected", () => {
  console.log("DB desconectada");
});

connection.on("error", (error) => {
  console.log("Error en la DB: " + error);
});
