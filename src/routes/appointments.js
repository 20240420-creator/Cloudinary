import express from "express";
import appointmentController from "../controllers/appointmentController.js";
import verifyToken from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/")
  .get(verifyToken, appointmentController.getAppointments)
  .post(verifyToken, appointmentController.createAppointment);

router.route("/:id")
  .get(verifyToken, appointmentController.getAppointmentById)
  .put(verifyToken, appointmentController.updateAppointment)
  .delete(verifyToken, appointmentController.deleteAppointment);

export default router;
