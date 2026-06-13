import express from "express";
import medicalRecordController from "../controllers/medicalRecordController.js";
import verifyToken from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/")
  .get(verifyToken, medicalRecordController.getMedicalRecords)
  .post(verifyToken, medicalRecordController.createMedicalRecord);

router.route("/:id")
  .get(verifyToken, medicalRecordController.getMedicalRecordById)
  .put(verifyToken, medicalRecordController.updateMedicalRecord)
  .delete(verifyToken, medicalRecordController.deleteMedicalRecord);

// CRUD for medications array
router.route("/:id/medications")
  .post(verifyToken, medicalRecordController.addMedication);

router.route("/:id/medications/:medicationId")
  .put(verifyToken, medicalRecordController.updateMedication)
  .delete(verifyToken, medicalRecordController.deleteMedication);

export default router;
