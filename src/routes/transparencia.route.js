import express from "express";
import transparenciaController from "../controllers/transparencia.controller.js";
import authenticate from "../middleware/authenticate.js";
import authorize from "../middleware/authorize.js";

const router = express.Router();

router.get("/estructura", transparenciaController.getEstructuraTransparencia);

router.get("/:id/contenido", transparenciaController.getContenidoBySeccion);

router.get("/:id/archivos", transparenciaController.getArchivosBySeccion);

router.post("/", authenticate, transparenciaController.createSeccionBySuper);

router.patch("/:id", authenticate, transparenciaController.updateSeccionBySuper);

router.delete("/:id", authenticate, transparenciaController.deleteSeccionBySuper);

router.post("/:id/contenido", authenticate, transparenciaController.createContenidoBySuper);

router.patch("/contenido/:id", authenticate, transparenciaController.updateContenidoBySuper);

router.delete("/contenido/:id", authenticate, transparenciaController.deleteContenidoBySuper);

router.post("/:id/archivos", authenticate, transparenciaController.createArchivoBySuper);

router.delete("/archivos/:id", authenticate, transparenciaController.deleteArchivoBySuper);

router.get(
  "/publica",
  transparenciaController.getEstructuraPublica
);

export default router;
