import * as opinionesService from "../services/opiniones.service.js";

export const getOpiniones = async (req, res, next) => {
  try {
    const opiniones = await opinionesService.getAll();
    res.json(opiniones);
  } catch (error) {
    next(error);
  }
};

export const createOpinion = async (req, res, next) => {
  try {
    const { opinion, calificacion } = req.body;

    if (!opinion || !calificacion) {
      return res.status(400).json({ error: "Datos incompletos" });
    }

    const nuevaOpinion = await opinionesService.crearOpinion({
      pasajero_id: req.user.pasajero_id,
      nombre: `${req.user.nombre} ${req.user.apellido}`,
      opinion,
      calificacion
    });

    res.status(201).json(nuevaOpinion);
  } catch (error) {
    next(error);
  }
};