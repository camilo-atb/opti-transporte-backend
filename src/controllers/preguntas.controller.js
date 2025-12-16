import PreguntasFrecuentes from "../services/faq.service.js";
import usuario from "../services/empleado.service.js";

// Crear pregunta
const createQuestion = async (req, res, next) => {
  try {
    const requesterId = req.user.id;
    const requester = await usuario.mostrarUserPorIdSupabase(requesterId);

    if (!requester) {
      return res.status(404).json({ error: "Usuario no encontrado en la base de datos" });
    }

    const { pregunta, respuesta } = req.body;
    const savePregunta = await PreguntasFrecuentes.create(pregunta, respuesta);

    res.status(201).json(savePregunta);
  } catch (error) {
    next(error);
  }
};

// Editar pregunta
const editQuestion = async (req, res, next) => {
  try {
    const requesterId = req.user.id;
    const requester = await usuario.mostrarUserPorIdSupabase(requesterId);

    if (!requester) {
      return res.status(404).json({ error: "Usuario no encontrado en la base de datos" });
    }

    const { id } = req.params;
    const { pregunta, respuesta } = req.body;

    const modificarPregunta = await PreguntasFrecuentes.update(id, { pregunta, respuesta });

    res.status(200).json(modificarPregunta);
  } catch (error) {
    next(error);
  }
};

// Eliminar pregunta
const eliminarPregunta = async (req, res, next) => {
  try {
    const requesterId = req.user.id;
    const requester = await usuario.mostrarUserPorIdSupabase(requesterId);

    if (!requester) {
      return res.status(404).json({ error: "Usuario no encontrado en la base de datos" });
    }

    const { id } = req.params;
    await PreguntasFrecuentes.delete(id);

    res.status(204).send("Pregunta eliminada con éxito");
  } catch (error) {
    next(error);
  }
};

const getQuestions = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const preguntas = await PreguntasFrecuentes.getAll(page, limit);
    res.status(200).json(preguntas);
  } catch (error) {
    next(error);
  }
};

export default {
  createQuestion,
  editQuestion,
  eliminarPregunta,
  getQuestions
};