import express from "express";
import {
  listarViajes,
  obtenerViajePorId,
  crearViaje
} from "../controllers/viajes.controller.js";

import authenticate from "../middleware/authenticate.js";

const router = express.Router();

router.get("/", authenticate, listarViajes);
router.get("/:id", authenticate, obtenerViajePorId);
router.post("/", authenticate, crearViaje);

export default router;
