import express from "express";
import logoutController from "../controllers/logoutController.js";

const router = express.Router();

// POST /api/logout
router.route("/").post(logoutController.logout);

export default router;
