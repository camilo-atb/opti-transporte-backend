import express from "express";
import noticiasController from "../controllers/noticias.controller.js";
import authorize from "../middleware/authorize.js";
import authenticate from "../middleware/authenticate.js";

const router = express.Router();

// Últimas noticias
router.get("/ultimas", noticiasController.obtenerUltimasNoticias);

// Noticias con paginación
router.get("/", noticiasController.obtenerNoticiasPaginadas);

// Noticia completa
router.get("/:id", noticiasController.obtenerNoticiaPorId);

router.post(
  "/",
  authenticate,
  
  noticiasController.createNoticiaBySuper
);

router.patch(
  "/:id",
  authenticate,
  
  noticiasController.modificarNoticia
);

router.delete(
  "/:id",
  authenticate,
  
  noticiasController.eliminarNoticias
);

export default router;
