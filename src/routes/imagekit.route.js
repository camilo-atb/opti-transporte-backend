import express from "express";
import imagekitController from "../controllers/imagekit.controller.js";
import authenticate from "../middleware/authenticate.js";

const router = express.Router();

router.get("/auth", authenticate, imagekitController.getAuthParams);

export default router;
