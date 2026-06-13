import express from "express";
import equipmentController from "../controllers/equipmentController.js";
import upload from "../utils/cloudinaryConfig.js";
import verifyToken from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/")
  .get(verifyToken, equipmentController.getEquipments)
  .post(verifyToken, upload.single("image"), equipmentController.createEquipment);

router.route("/:id")
  .get(verifyToken, equipmentController.getEquipmentById)
  .put(verifyToken, upload.single("image"), equipmentController.updateEquipment)
  .delete(verifyToken, equipmentController.deleteEquipment);

export default router;
