import express from "express";
import recoveryPasswordController from "../controllers/recoveryPasswordController.js";

const router = express.Router();

router.route("/").post(recoveryPasswordController.requestCode);


router.route("/verify").post(recoveryPasswordController.verifyCode);


router.route("/new-password").post(recoveryPasswordController.newPassword);

export default router;
