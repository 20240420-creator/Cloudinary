import express from "express";
import recoveryPasswordController from "../controllers/recoveryPasswordController.js";

const router = express.Router();

// POST /api/recovery - Paso 1: Solicitar código
router.route("/").post(recoveryPasswordController.requestCode);

// POST /api/recovery/verify - Paso 2: Verificar código
router.route("/verify").post(recoveryPasswordController.verifyCode);

// POST /api/recovery/new-password - Paso 3: Cambiar contraseña
router.route("/new-password").post(recoveryPasswordController.newPassword);

export default router;
