import express from "express";
import authorize from "../middleware/authorize.js";
import authenticate from "../middleware/authenticate.js";
import {
  crearOpinion,
  obtenerOpiniones,
  obtenerOpinionPorId,
  actualizarOpinion,
  eliminarOpinion,
} from "../controllers/opiniones.controller";

const router = express.Router();

router.post("/", authenticate, authorize(["pasajero"]), crearOpinion);
router.get("/", authenticate, authorize(["pasajero"]), obtenerOpiniones);
router.get("/:id", authenticate, authorize(["pasajero"]), obtenerOpinionPorId);
router.patch("/:id", authenticate, authorize(["pasajero", "super-usuario"]), actualizarOpinion);
router.delete("/:id", authenticate, authorize(["pasajero", "super-usuario"]), eliminarOpinion);

export default router;
