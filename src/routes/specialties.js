import express from "express";
import specialtyController from "../controllers/specialtyController.js";
import verifyToken from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/")
  .get(verifyToken, specialtyController.getSpecialties)
  .post(verifyToken, specialtyController.createSpecialty);

router.route("/:id")
  .get(verifyToken, specialtyController.getSpecialtyById)
  .put(verifyToken, specialtyController.updateSpecialty)
  .delete(verifyToken, specialtyController.deleteSpecialty);

export default router;
