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

router.post("/", authenticate, authorize(["super-usuario"]), noticiasController.createNoticiaBySuper);

router.patch("/:id", authenticate, authorize(["super-usuario"]), noticiasController.modificarNoticia);

router.delete("/:idNoticia", authenticate, authorize(["super-usuario"]), noticiasController.eliminarNoticias);

export default router;
