import express from "express";
import transparenciaController from "../controllers/transparencia.controller.js";
import authenticate from "../middleware/authenticate.js";
import authorize from "../middleware/authorize.js";

const router = express.Router();

router.get(
  "/",
  authenticate,
  authorize(["super-usuario"]),
  transparenciaController.getEstructuraTransparencia
);
router.post(
  "/",
  authenticate,
  authorize(["super-usuario"]),
  transparenciaController.createSeccionBySuper
);
router.patch(
  "/:id",
  authenticate,
  authorize(["super-usuario"]),
  transparenciaController.updateSeccionBySuper
);
router.delete(
  "/:id",
  authenticate,
  authorize(["super-usuario"]),
  transparenciaController.deleteSeccionBySuper
);

export default router;
