import express from "express";
import {
  getUserXIdsupabase,
  createUserByAdmin,
  updateUser,
  listarUsuarios,
  desactivarCuenta,
} from "../controllers/empleados.controller.js";
import authenticate from "../middleware/authenticate.js";
import authorize from "../middleware/authorize.js";

const router = express.Router();

// Listar empleados (solo super)
router.get("/", authenticate, authorize(["super-usuario"]), listarUsuarios);

// Obtener rol (empleado o pasajero) // ESTA
router.get("/rol/:id_auth_supabase", authenticate, getUserXIdsupabase);

// Crear empleado (solo super)
router.post("/", authenticate, authorize(["super-usuario"]), createUserByAdmin);

// Desactivar cuenta (empleado o pasajero)
router.patch(
  "/desactivar/:tipo/:id_auth_supabase",
  authenticate,
  authorize(["super-usuario"]),
  desactivarCuenta
);

// Editar perfil empleado
router.patch("/:id_auth_supabase", authenticate, updateUser);

export default router;
