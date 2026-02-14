import ViajesService from "../services/viajes.service.js";
import usuario from "../services/empleado.service.js";

const viajesService = new ViajesService();

export const listarViajes = async (req, res, next) => {
  try {
    const requester = await usuario.mostrarUserPorIdSupabase(req.user.id);

    if (!requester) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    const viajes = await viajesService.listarViajes();
    res.status(200).json(viajes);
  } catch (error) {
    next(error);
  }
};

export const obtenerViajePorId = async (req, res, next) => {
  try {
    const requester = await usuario.mostrarUserPorIdSupabase(req.user.id);

    if (!requester) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    const { id } = req.params;

    const viaje = await viajesService.obtenerViajePorId(id);

    if (!viaje) {
      return res.status(404).json({ error: "Viaje no encontrado." });
    }

    res.status(200).json(viaje);
  } catch (error) {
    next(error);
  }
};

export const crearViaje = async (req, res, next) => {
  try {
    const operario = await usuario.mostrarUserPorIdSupabase(req.user.id);

    if (!operario) {
      return res.status(404).json({ error: "Operario no registrado." });
    }

    const viaje = await viajesService.crearViaje({
      ...req.body,
      creado_por: operario.id
    });

    res.status(201).json({
      message: "Viaje creado correctamente",
      viaje
    });
  } catch (error) {
    next(error);
  }
};