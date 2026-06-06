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
  .put(verifyToken, upload.single("profileImage"), userController.updateUser)
  .delete(verifyToken, userController.deleteUser);

// =============================================
// CRUD CON ARRAYS - DIRECCIONES
// =============================================

// GET    /api/users/:id/addresses             - Ver direcciones
// POST   /api/users/:id/addresses             - Agregar dirección
router
  .route("/:id/addresses")
  .get(verifyToken, userController.getAddresses)
  .post(verifyToken, userController.addAddress);

// PUT    /api/users/:id/addresses/:addressId  - Editar una dirección
// DELETE /api/users/:id/addresses/:addressId  - Eliminar una dirección
router
  .route("/:id/addresses/:addressId")
  .put(verifyToken, userController.updateAddress)
  .delete(verifyToken, userController.deleteAddress);

export default router;
