import express from "express";
import {
  crearVenta,
  obtenerSillasOcupadas,
  historialVentasOperario,
  resumenOperario,
  obtenerTicketVenta
} from "../controllers/ventas.controller.js";


import authenticate from "../middleware/authenticate.js";

const router = express.Router();

router.post("/", authenticate, crearVenta);
router.get("/sillas-ocupadas/:viajeId", authenticate, obtenerSillasOcupadas);
router.get("/historial", authenticate, historialVentasOperario);
router.get("/resumen-operario", authenticate, resumenOperario);
router.get("/:ventaId/ticket", authenticate, obtenerTicketVenta);

export default router;
