import express from "express";

import {
  crearVenta,
  crearVentaPublica,
  obtenerSillasOcupadas,
  historialVentasOperario,
  historialVentasPasajero,
  resumenOperario,
  obtenerTicketVenta,
  getTicketPublic
} from "../controllers/ventas.controller.js";


import authenticate from "../middleware/authenticate.js";
import authenticatePasajero from "../middleware/authenticatePasajeros.js";

const router = express.Router();

router.post("/public", authenticatePasajero, crearVentaPublica);
router.post("/", authenticate, crearVenta);

router.get("/sillas-ocupadas/public/:viajeId", obtenerSillasOcupadas);
router.get("/sillas-ocupadas/:viajeId", authenticate, obtenerSillasOcupadas);

router.get("/historial", authenticate, historialVentasOperario);
router.get("/mis-compras", authenticatePasajero, historialVentasPasajero);
router.get("/resumen-operario", authenticate, resumenOperario);

router.get("/public/:id/ticket", getTicketPublic);
router.get("/:ventaId/ticket", authenticate, obtenerTicketVenta);


export default router;
