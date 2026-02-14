import pasajerosService from "../services/pasajeros.service.js";

export const obtenerOCrearPasajeroPorCedula = async (req, res, next) => {
  try {
    const { cedula, nombre, apellido, telefono } = req.body;

    if (!cedula) {
      return res.status(400).json({ error: "La cédula es obligatoria" });
    }

    let pasajero = await pasajerosService.mostrarPasajeroPorCedula(cedula);

    if (!pasajero) {
      if (!nombre || !apellido) {
        return res.status(400).json({
          error: "Nombre y apellido son obligatorios para crear pasajero",
        });
      }

      pasajero = await pasajerosService.crearPasajeroBasico({
        cedula,
        nombre,
        apellido,
        telefono,
      });
    }

    res.status(200).json(pasajero);
  } catch (error) {
    next(error);
  }
};
