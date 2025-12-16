import opinionesService from "../services/opiniones.service.js";
import pasajerosService from "../services/pasajeros.service.js";

// Crear una opinión
export const crearOpinion = async (req, res, next) => {
  try {
    const idAuthSupabase = req.user.id;
    const pasajero = await pasajerosService.mostrarPasajeroPorIdSupabase(idAuthSupabase);

    if (!pasajero) {
      return res.status(404).json({ error: "El pasajero no existe o no está registrado" });
    }

    const nuevaOpinion = await opinionesService.createOpinion(pasajero.id, req.body);

    return res.status(201).json({
      mensaje: "Opinión creada exitosamente",
      opinion: nuevaOpinion,
    });
  } catch (error) {
    console.error("Error al crear la opinión:", error.message);
    next(error);
  }
};

// Obtener todas las opiniones aprobadas
export const obtenerOpiniones = async (req, res, next) => {
  try {
    const opiniones = await opinionesService.getOpiniones(true);
    return res.status(200).json(opiniones);
  } catch (error) {
    console.error("Error en obtenerOpiniones:", error.message);
    next(error);
  }
};

// Obtener una opinión específica por ID
export const obtenerOpinionPorId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const opinion = await opinionesService.getOpinionById(id);

    if (!opinion) {
      return res.status(404).json({ error: "Opinión no encontrada" });
    }

    return res.status(200).json(opinion);
  } catch (error) {
    console.error("Error en obtenerOpinionPorId:", error.message);
    next(error);
  }
};

// Actualizar una opinión
export const actualizarOpinion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const idAuthSupabase = req.user.id;

    const pasajero = await pasajerosService.mostrarPasajeroPorIdSupabase(idAuthSupabase);

    const opinionExistente = await opinionesService.getOpinionById(id);
    if (!opinionExistente) {
      return res.status(404).json({ error: "Opinión no encontrada" });
    }

    if (
      req.user.rol !== "super-usuario" &&
      (!pasajero || opinionExistente.user_id !== pasajero.id)
    ) {
      return res.status(403).json({ error: "No tienes permiso para editar esta opinión" });
    }

    const opinionActualizada = await opinionesService.updateOpinion(id, req.body);
    res.status(200).json({
      mensaje: "Opinión actualizada correctamente",
      opinion: opinionActualizada,
    });
  } catch (error) {
    console.error("Error en actualizarOpinion:", error.message);
    next(error);
  }
};

// Eliminar una opinión
export const eliminarOpinion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const idAuthSupabase = req.user.id;

    const pasajero = await pasajerosService.mostrarPasajeroPorIdSupabase(idAuthSupabase);
    if (!pasajero) {
      return res.status(404).json({ error: "Pasajero no encontrado" });
    }

    const opinion = await opinionesService.getOpinionById(id);
    if (!opinion) {
      return res.status(404).json({ error: "Opinión no encontrada" });
    }
    if (opinion.user_id !== pasajero.id) {
      return res.status(403).json({ error: "No tienes permiso para eliminar esta opinión" });
    }

    const resultado = await opinionesService.deleteOpinion(id);

    return res.status(200).json(resultado);
  } catch (error) {
    console.error("Error en eliminarOpinion:", error.message);
    next(error);
  }
};
