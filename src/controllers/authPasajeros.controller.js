import supabase from "../config/supabase.js";
import pasajerosService from "../services/pasajeros.service.js";

// Crear pasajero
export const signUpNewEmail = async (req, res, next) => {
  try {
    const { email, password, nombre, apellido, telefono } = req.body;

    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return res.status(400).json({ error: error.message });

    const newPasajero = await pasajerosService.crearPasajero(
      data.user.id,
      nombre,
      apellido,
      telefono
    );

    res.status(201).json({ pasajero: newPasajero });
  } catch (error) {
    next(error);
  }
};

// Login
export const signInPasajero = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) return res.status(400).json({ error: error.message });

    const pasajero = await pasajerosService.mostrarPasajeroPorIdSupabase(data.user.id);
    if (!pasajero) return res.status(404).json({ error: "Pasajero no encontrado" });

    res.status(200).json({ session: data.session, pasajero });
  } catch (error) {
    next(error);
  }
};

// Obtener perfil
export const getPerfilPasajero = async (req, res, next) => {
  try {
    const idAuthSupabase = req.user.id; // viene del middleware authenticate
    const pasajero = await pasajerosService.mostrarPasajeroPorIdSupabase(idAuthSupabase);
    if (!pasajero) return res.status(404).json({ error: "No se encontró el pasajero" });
    res.status(200).json(pasajero);
  } catch (error) {
    next(error);
  }
};

// Actualizar perfil
export const updatePasajero = async (req, res, next) => {
  try {
    const idAuthSupabase = req.user.id;
    const { nombre, apellido, telefono } = req.body;

    const pasajeroActualizado = await pasajerosService.actualizarPasajero(idAuthSupabase, {
      nombre,
      apellido,
      telefono,
    });
    res.status(200).json(pasajeroActualizado);
  } catch (error) {
    next(error);
  }
};

// Eliminar cuenta
export const deletePasajero = async (req, res, next) => {
  try {
    const idAuthSupabase = req.params.id_auth_supabase || req.user.id;

    // Borrar en base local
    await pasajerosService.eliminarPasajero(idAuthSupabase);

    // Borrar también en Supabase Auth (solo si es su propia cuenta)
    if (req.user.id === idAuthSupabase) {
      await supabase.auth.admin.deleteUser(idAuthSupabase);
    }

    res.status(200).json({ mensaje: "Cuenta eliminada correctamente" });
  } catch (error) {
    next(error);
  }
};

// Cambiar contraseña
export const cambiarPasswordPasajero = async (req, res, next) => {
  try {
    const { nuevaPassword } = req.body;
    if (!nuevaPassword || nuevaPassword.length < 6)
      return res.status(400).json({ error: "La contraseña debe tener al menos 6 caracteres" });

    const { error } = await supabase.auth.updateUser({ password: nuevaPassword });
    if (error) return res.status(400).json({ error: error.message });

    res.status(200).json({ mensaje: "Contraseña actualizada correctamente" });
  } catch (error) {
    next(error);
  }
};
