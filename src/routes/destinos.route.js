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

router.post("/cards", authenticate,  crearCard);
router.post("/pages/:destinoId", authenticate,  crearPage);
router.patch("/cards/:id", authenticate,  editarCard);
router.patch("/pages/:id", authenticate,  editarPage);
router.get("/cards", obtenerCards);
router.get("/cards/:id", obtenerDestinoCompleto);
router.delete("/cards/:id", authenticate,  eliminarCard);

export default router;
