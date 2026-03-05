import express from "express";
import {
  getUserXIdsupabase,
  createUserByAdmin,
  updateUser,
  listarUsuarios,
  desactivarCuenta,
  getMiPerfil,
} from "../controllers/empleados.controller.js";
import authenticate from "../middleware/authenticate.js";
import authorize from "../middleware/authorize.js";

const router = express.Router();

// Listar empleados (solo super)
router.get("/", authenticate,  listarUsuarios);

// Obtener rol (empleado o pasajero) // ESTA
router.get("/rol/:id_auth_supabase", authenticate, getUserXIdsupabase);

router.get("/me", authenticate, getMiPerfil);


// Crear empleado (solo super)
router.post("/", authenticate,  createUserByAdmin);

// Desactivar cuenta (empleado o pasajero)
router.patch(
  "/desactivar/:tipo/:id_auth_supabase",
  authenticate,
  
  desactivarCuenta
);

// Editar perfil empleado
router.patch("/:id_auth_supabase", authenticate, updateUser);

export default router;
