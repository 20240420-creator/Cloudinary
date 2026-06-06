import express from "express";
import registerController from "../controllers/registerController.js";

const router = express.Router();

// POST /api/register - Paso 1: Registrar y enviar código
router.route("/").post(registerController.register);

// POST /api/register/verify - Paso 2: Verificar código y guardar en BD
router.route("/verify").post(registerController.verifyCode);

export default router;
