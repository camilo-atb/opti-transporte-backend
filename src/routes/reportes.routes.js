import express from "express";
import authenticate from "../middleware/authenticate.js";
import authorize from "../middleware/authorize.js";
import * as reportesController from "../controllers/reportes.controller.js";

const router = express.Router();

router.get(
  "/resumen",
  authenticate,
  authorize(["administrativo", "super-usuario"]),
  reportesController.resumenGeneral
);

router.get(
  "/mensual",
  authenticate,
  authorize(["administrativo", "super-usuario"]),
  reportesController.reporteMensual
);

router.get(
  "/rango",
  authenticate,
  authorize(["administrativo", "super-usuario"]),
  reportesController.reportePorFechas
);

router.get(
  "/operarios",
  authenticate,
  authorize(["administrativo", "super-usuario"]),
  reportesController.ventasPorOperario
);

router.get(
  "/rutas",
  authenticate,
  authorize(["administrativo", "super-usuario"]),
  reportesController.ventasPorRuta
);

router.get(
  "/ocupacion",
  authenticate,
  authorize(["administrativo", "super-usuario"]),
  reportesController.ocupacionPorViaje
);

router.get(
  "/top-rutas",
  authenticate,
  authorize(["administrativo", "super-usuario"]),
  reportesController.topRutas
);

router.get(
  "/historico",
  authenticate,
  authorize(["administrativo", "super-usuario"]),
  reportesController.historicoAnual
);

export default router;
