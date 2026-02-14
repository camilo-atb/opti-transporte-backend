import { Router } from "express";
import { obtenerOCrearPasajeroPorCedula } from "../controllers/pasajeros.controller.js";

import authenticate from "../middleware/authenticate.js";

const router = Router();

router.post(
  "/por-cedula",
  authenticate,
  obtenerOCrearPasajeroPorCedula
);

export default router;
