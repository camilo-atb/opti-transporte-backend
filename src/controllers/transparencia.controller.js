import Transparencia from "../services/transparencia.service.js";
import usuario from "../services/empleado.service.js";

// Crear sección o subsección
const createSeccionBySuper = async (req, res, next) => {
  try {
    const requesterId = req.user.id;
    const requester = await usuario.mostrarUserPorIdSupabase(requesterId);

    if (!requester) {
      return res.status(404).json({ error: "Usuario no encontrado en la base de datos" });
    }

    const { titulo, slug, parentId, orden } = req.body;

    const nuevaSeccion = await Transparencia.create(titulo, slug, parentId, orden);
    res.status(201).json(nuevaSeccion);
  } catch (error) {
    next(error);
  }
};

// Obtener estructura completa de transparencia
const getEstructuraTransparencia = async (_, res, next) => {
  try {
    const estructura = await Transparencia.getAll();
    res.status(200).json(estructura);
  } catch (error) {
    next(error);
  }
};

const updateSeccionBySuper = async (req, res, next) => {
  try {
    const requesterId = req.user.id;
    const requester = await usuario.mostrarUserPorIdSupabase(requesterId);

    if (!requester) {
      return res.status(404).json({ error: "Usuario no encontrado en la base de datos" });
    }

    const { id } = req.params;
    const { titulo, slug, orden } = req.body;

    const seccionActualizada = await Transparencia.update(id, titulo, slug, orden);
    res.status(200).json(seccionActualizada);
  } catch (error) {
    next(error);
  }
};

// Eliminación lógica
const deleteSeccionBySuper = async (req, res, next) => {
  try {
    const requesterId = req.user.id;
    const requester = await usuario.mostrarUserPorIdSupabase(requesterId);

    if (!requester) {
      return res.status(404).json({ error: "Usuario no encontrado en la base de datos" });
    }

    const { id } = req.params;
    const result = await Transparencia.softDelete(id);

    res.status(200).json({ message: result });
  } catch (error) {
    next(error);
  }
};

export default {
  createSeccionBySuper,
  getEstructuraTransparencia,
  updateSeccionBySuper,
  deleteSeccionBySuper,
};
