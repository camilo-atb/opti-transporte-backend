import express from "express";
import authorize from "../middleware/authorize.js";
import authenticate from "../middleware/authenticate.js";
import preguntasController from "../controllers/preguntas.controller.js";

const router = express.Router();

// Obtener preguntas
router.get("/", preguntasController.getQuestions);
// Modificar pregunta
router.patch("/:id", authenticate,  preguntasController.editQuestion);
// Eliminar pregunta
router.delete(
  "/:id",
  authenticate,
  
  preguntasController.eliminarPregunta
);
// Crear pregunta
router.post("/", authenticate,  preguntasController.createQuestion);

export default router;
