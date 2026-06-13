import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

// Importar rutas
import registerRoutes from "./src/routes/register.js";
import loginRoutes from "./src/routes/login.js";
import logoutRoutes from "./src/routes/logout.js";
import recoveryRoutes from "./src/routes/recovery.js";
import userRoutes from "./src/routes/users.js";
import equipmentRoutes from "./src/routes/equipments.js";
import specialtyRoutes from "./src/routes/specialties.js";
import appointmentRoutes from "./src/routes/appointments.js";
import medicalRecordRoutes from "./src/routes/medicalRecords.js";

const app = express();

// Middlewares
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true, // Permite el envío de cookies
  })
);
app.use(cookieParser());
app.use(express.json());

// Rutas
app.use("/api/register", registerRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/logout", logoutRoutes);
app.use("/api/recovery", recoveryRoutes);
app.use("/api/users", userRoutes);
app.use("/api/equipments", equipmentRoutes);
app.use("/api/specialties", specialtyRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/medical-records", medicalRecordRoutes);

export default app;
