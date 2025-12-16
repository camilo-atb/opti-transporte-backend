import express from "express";
import {
  getUserXIdsupabase,
  createUserByAdmin,
  updateUser,
  deleteUser,
  listarUsuarios,
  cambiarPassword,
} from "../controllers/empleados.controller.js";
import authenticate from "../middleware/authenticate.js";
import authorize from "../middleware/authorize.js";

const router = express.Router();

router.get("/", authenticate, authorize(["super-usuario"]), listarUsuarios);
router.get("/:id_auth_supabase", authenticate, getUserXIdsupabase);
router.post("/create-by-admin", authenticate, authorize(["super-usuario"]), createUserByAdmin);
router.patch(
  "/:id_auth_supabase",
  authenticate,
  authorize(["super-usuario", "operario", "administrativo"]),
  updateUser
);
router.patch(
  "/cambiar-password",
  authenticate,
  authorize(["super-usuario", "operario", "administrativo"], cambiarPassword)
);
router.delete("/:id_auth_supabase", authenticate, authorize(["super-usuario"]), deleteUser);

export default router;
