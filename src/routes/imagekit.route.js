import express from "express";
import imagekitController from "../controllers/imagekit.controller.js";
import authenticate from "../middleware/authenticate.js";
import authorize from "../middleware/authorize.js";

const router = express.Router();

router.get(
    "/auth", authenticate, authorize(["super-usuario"]), imagekitController.getAuthParams
);

export default router;
