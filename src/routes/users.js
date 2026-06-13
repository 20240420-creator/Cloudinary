import express from "express";
import userController from "../controllers/userController.js";
import upload from "../utils/cloudinaryConfig.js";
import verifyToken from "../middlewares/authMiddleware.js";

const router = express.Router();

// =============================================
// CRUD BASICO DE USUARIOS
// =============================================

// GET    /api/users          - Obtener todos los usuarios
router.route("/").get(verifyToken, userController.getUsers);

// GET    /api/users/:id      - Obtener un usuario
// PUT    /api/users/:id      - Actualizar (con foto de perfil)
// DELETE /api/users/:id      - Eliminar usuario
router
  .route("/:id")
  .get(verifyToken, userController.getUserById)
  .put(verifyToken, upload.single("profilePhoto"), userController.updateUser)
  .delete(verifyToken, userController.deleteUser);

// =============================================
// CRUD CON ARRAYS - CONTACTOS DE EMERGENCIA
// =============================================

router
  .route("/:id/emergency-contacts")
  .get(verifyToken, userController.getEmergencyContacts)
  .post(verifyToken, userController.addEmergencyContact);

router
  .route("/:id/emergency-contacts/:contactId")
  .put(verifyToken, userController.updateEmergencyContact)
  .delete(verifyToken, userController.deleteEmergencyContact);

export default router;
