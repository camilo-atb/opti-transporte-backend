import VentasService from "../services/ventas.service.js";
import TiquetesService from "../services/tiquetes.service.js";
import pasajerosService from "../services/pasajeros.service.js";
import usuario from "../services/empleado.service.js";

const ventasService = new VentasService();
const tiquetesService = new TiquetesService();

export const crearVenta = async (req, res, next) => {
  try {
    const requesterId = req.user.id;
    const operario = await usuario.mostrarUserPorIdSupabase(requesterId);

    if (!operario) {
      return res.status(404).json({ error: "Operario no encontrado." });
    }

    if (operario.rol !== "operario") {
      return res.status(403).json({ error: "No autorizado para realizar ventas." });
    }

    const {
      viaje_id,
      sillas,
      precio_unitario,
      pasajero
    } = req.body;

    if (
      !viaje_id ||
      !Array.isArray(sillas) ||
      sillas.length === 0 ||
      !precio_unitario ||
      !pasajero?.cedula
    ) {
      return res.status(400).json({
        error: "Datos incompletos para realizar la venta."
      });
    }

    const { cedula, nombre, apellido, telefono } = pasajero;

    let pasajeroDB = await pasajerosService.mostrarPasajeroPorCedula(cedula);

    if (!pasajeroDB) {
      pasajeroDB = await pasajerosService.crearPasajeroBasico({
        cedula,
        nombre,
        apellido,
        telefono,
      });
    }

    const venta = await ventasService.crearVenta({
      operario_id: operario.id,
      pasajero_id: pasajeroDB.id,
      viaje_id,
      sillas,
      precio_unitario,
    });

    // ✅ RESPUESTA CORREGIDA
    res.status(201).json({
      success: true,
      ventaId: venta.id, // ← ESTO ES LO CRÍTICO
      message: "Venta creada exitosamente"
    });

  } catch (error) {
    next(error);
  }
};

export const obtenerSillasOcupadas = async (req, res, next) => {
  try {
    const { viajeId } = req.params;

    if (!viajeId) {
      return res.status(400).json({ error: "ID del viaje requerido." });
    }

    const sillasOcupadas = await tiquetesService.obtenerSillasOcupadas(viajeId);
    console.log("SILLAS RECIBIDAS:", sillasOcupadas);


    res.status(200).json({
      viaje_id: viajeId,
      sillas_ocupadas: sillasOcupadas
    });

  } catch (error) {
    next(error);
  }
};

export const historialVentasOperario = async (req, res, next) => {
  try {
    const requesterId = req.user.id;
    const operario = await usuario.mostrarUserPorIdSupabase(requesterId);

    if (!operario) {
      return res.status(404).json({ error: "Operario no encontrado." });
    }

    const historial = await ventasService.historialPorOperario(operario.id);

    res.status(200).json(historial);

  } catch (error) {
    next(error);
  }
};

export const resumenOperario = async (req, res, next) => {
  try {
    const requesterId = req.user.id;
    const operario = await usuario.mostrarUserPorIdSupabase(requesterId);

    if (!operario) {
      return res.status(404).json({ error: "Operario no encontrado." });
    }

    const resumen = await ventasService.resumenOperario(operario.id);

    res.status(200).json(resumen);

  } catch (error) {
    next(error);
  }
};

export const obtenerTicketVenta = async (req, res, next) => {
  try {
    const { ventaId } = req.params;

    if (!ventaId) {
      return res.status(400).json({
        error: "ID de la venta requerido.",
      });
    }

    const ticket =
      await ventasService.obtenerTicketPorVenta(
        ventaId
      );

    if (!ticket) {
      return res.status(404).json({
        error: "Ticket no encontrado.",
      });
    }

    res.status(200).json(ticket);

  } catch (error) {
    next(error);
  }
};

