import express from "express";
import authUsuariosController from "../controllers/authEmpleados.controller.js";
const router = express.Router();

// Inicio de sesión empleados o superusuario
router.post("/signin", authUsuariosController.signInEmpleado);

export default router;
