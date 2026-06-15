import express from "express";
import registerController from "../controllers/registerController.js";

const router = express.Router();


router.route("/").post(registerController.register);


router.route("/verify").post(registerController.verifyCode);

export default router;
