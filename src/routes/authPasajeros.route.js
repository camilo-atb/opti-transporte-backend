import express from "express";
import * as pasajerosController from "../controllers/authPasajeros.controller.js";
import authenticate from "../middleware/authenticate.js";
import authorize from "../middleware/authorize.js";
import pasajerosService from "../services/pasajeros.service.js";

const router = express.Router();

// Registro e inicio de sesión
router.post("/signup", pasajerosController.signUpNewEmail);
router.post("/signin", pasajerosController.signInPasajero);

router.get("/me", authenticate, pasajerosController.getPerfilPasajero);
router.patch("/me", authenticate, pasajerosController.updatePasajero);
router.patch("/me/cambiar-password", authenticate, pasajerosController.cambiarPasswordPasajero);
router.delete("/me", authenticate, pasajerosController.deletePasajero);

// Superusuario
router.get("/", authenticate, authorize(["super-usuario"]), async (req, res, next) => {
  try {
    const pasajeros = await pasajerosService.listarPasajeros();
    res.status(200).json(pasajeros);
  } catch (error) {
    next(error);
  }
});

router.delete(
  "/:id_auth_supabase",
  authenticate,
  authorize(["super-usuario"]),
  pasajerosController.deletePasajero
);

export default router;
