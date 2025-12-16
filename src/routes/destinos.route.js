import express from "express";
import authorize from "../middleware/authorize.js";
import authenticate from "../middleware/authenticate.js";
import {
  crearCard,
  crearPage,
  editarCard,
  editarPage,
  obtenerCards,
  obtenerDestinoCompleto,
  eliminarCard,
} from "../controllers/destinos.controller.js";

const router = express.Router();

router.post("/cards", authenticate, authorize(["super-usuario"]), crearCard);
router.post("/pages/:destinoId", authenticate, authorize(["super-usuario"]), crearPage);
router.patch("/cards/:id", authenticate, authorize(["super-usuario"]), editarCard);
router.patch("/pages/:id", authenticate, authorize(["super-usuario"]), editarPage);
router.get("/cards", obtenerCards);
router.get("/cards/:id", obtenerDestinoCompleto);
router.delete("/cards/:id", authenticate, authorize(["super-usuario"]), eliminarCard);

export default router;
