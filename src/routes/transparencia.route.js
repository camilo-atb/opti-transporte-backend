import express from "express";
import transparenciaController from "../controllers/transparencia.controller.js";
import authenticate from "../middleware/authenticate.js";
import authorize from "../middleware/authorize.js";

const router = express.Router();

router.get("/estructura", transparenciaController.getEstructuraTransparencia);

router.get("/:id/contenido", transparenciaController.getContenidoBySeccion);

router.get("/:id/archivos", transparenciaController.getArchivosBySeccion);

router.post("/", authenticate, authorize(["super-usuario"]), transparenciaController.createSeccionBySuper);

router.patch("/:id", authenticate, authorize(["super-usuario"]), transparenciaController.updateSeccionBySuper);

router.delete("/:id", authenticate, authorize(["super-usuario"]), transparenciaController.deleteSeccionBySuper);

router.post("/:id/contenido", authenticate, authorize(["super-usuario"]), transparenciaController.createContenidoBySuper);

router.patch("/contenido/:id", authenticate, authorize(["super-usuario"]), transparenciaController.updateContenidoBySuper);

router.delete("/contenido/:id", authenticate, authorize(["super-usuario"]), transparenciaController.deleteContenidoBySuper);

router.post("/:id/archivos", authenticate, authorize(["super-usuario"]), transparenciaController.createArchivoBySuper);

router.delete("/archivos/:id", authenticate, authorize(["super-usuario"]), transparenciaController.deleteArchivoBySuper);

router.get(
  "/publica",
  transparenciaController.getEstructuraPublica
);

export default router;
