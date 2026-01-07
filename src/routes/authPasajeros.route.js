import express from "express";
import * as pasajerosController from "../controllers/authPasajeros.controller.js";
import authenticate from "../middleware/authenticate.js";
import authorize from "../middleware/authorize.js";
import pasajerosService from "../services/pasajeros.service.js";

const router = express.Router();

// Auth
router.post("/signup", pasajerosController.signUpNewEmail);
router.post("/signin", pasajerosController.signInPasajero);

// Perfil propio
router.get("/me", authenticate, pasajerosController.getPerfilPasajero);
router.patch("/me", authenticate, pasajerosController.updatePasajero);

// Desactivar cuenta propia
router.patch("/me/desactivar", authenticate, pasajerosController.desactivarMiCuenta);

// Superusuario
router.get(
  "/",
  authenticate,
  authorize(["super-usuario"]),
  async (req, res, next) => {
    try {
      const pasajeros = await pasajerosService.listarPasajeros();
      res.json(pasajeros);
    } catch (e) {
      next(e);
    }
  }
);

export default router;
