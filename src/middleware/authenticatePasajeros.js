import supabase from "../config/supabase.js";
import pasajerosService from "../services/pasajeros.service.js";

const authenticatePasajero = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Sin autorización" });
    }

    // Validar token en Supabase
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: "Token inválido o no autenticado" });
    }

    // Buscar pasajero en tu tabla usuarios_pasajeros
    const pasajero = await pasajerosService.mostrarPasajeroPorIdSupabase(user.id);

    if (!pasajero) {
      return res.status(404).json({ error: "Pasajero no registrado en base local" });
    }

    if (pasajero.estado !== "activo") {
      return res.status(403).json({ error: "Cuenta desactivada" });
    }

    // Guardamos info útil
    req.user = {
      id: user.id,
      rol: pasajero.rol,
      nombre: pasajero.nombre,
      apellido: pasajero.apellido,
      telefono: pasajero.telefono,
    };

    req.pasajero = pasajero;

    next();
  } catch (err) {
    next(err);
  }
};

export default authenticatePasajero;

