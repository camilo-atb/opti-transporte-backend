// controllers/usuarios.controller.js
import supabase from "../config/supabase.js";
import userService from "../services/empleado.service.js";
import pasajerosService from "../services/pasajeros.service.js";

// Obtener rol por id de Supabase
export const getUserXIdsupabase = async (req, res, next) => {
  try {
    const { id_auth_supabase } = req.params;
    let rol = await userService.mostrarRolPorId(id_auth_supabase);

    if (!rol) {
      rol = await pasajerosService.mostrarRolPorId(id_auth_supabase);
    }

    if (!rol) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.status(200).json({ rol });
  } catch (error) {
    next(error);
  }
};

// Crear usuario
export const createUserByAdmin = async (req, res, next) => {
  try {
    const requester = await userService.mostrarUserPorIdSupabase(req.user.id);

    if (!requester || requester.rol !== "super-usuario") {
      return res.status(403).json({ error: "No tienes permisos para crear usuarios" });
    }

    const { email, password, nombre, apellido, telefono, rol, ruta_imagen } = req.body;

    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return res.status(400).json({ error: error.message });

    const newUser = await userService.crearUser(
      data.user.id,
      nombre,
      apellido,
      telefono,
      rol,
      ruta_imagen
    );

    res.status(201).json({
      mensaje: "Usuario creado correctamente",
      user: newUser,
    });
  } catch (error) {
    next(error);
  }
};

// Actualizar usuario
export const updateUser = async (req, res, next) => {
  try {
    const { id_auth_supabase } = req.params;
    const requester = req.user;

    if (requester.rol !== "super-usuario" && requester.id !== id_auth_supabase) {
      return res.status(403).json({
        error: "No tienes permiso para editar este usuario",
      });
    }

    const updated = await userService.actualizarUser(id_auth_supabase, req.body);
    if (!updated) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.status(200).json({
      mensaje: "Usuario actualizado correctamente",
      usuario: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const desactivarCuenta = async (req, res, next) => {
  try {
    const { id_auth_supabase, tipo } = req.params;

    let result;
    if (tipo === "empleado") {
      result = await userService.cambiarEstado(id_auth_supabase, "inactivo");
    } else if (tipo === "pasajero") {
      result = await pasajerosService.cambiarEstado(id_auth_supabase, "inactivo");
    } else {
      return res.status(400).json({ error: "Tipo inválido" });
    }

    if (!result) return res.status(404).json({ error: "Usuario no encontrado" });

    res.status(200).json({ mensaje: "Cuenta desactivada", usuario: result });
  } catch (error) {
    next(error);
  }
};

// Eliminar usuario
/*export const deleteUser = async (req, res, next) => {
  try {
    const requester = req.user;
    const { id_auth_supabase } = req.params;

    if (requester.rol !== "super-usuario") {
      return res.status(403).json({ error: "Solo el super-usuario puede eliminar usuarios" });
    }

    const deleted = await userService.eliminarUser(id_auth_supabase);
    if (!deleted) return res.status(404).json({ error: "Usuario no encontrado" });

    res.status(200).json({ mensaje: "Usuario eliminado correctamente", usuario: deleted });
  } catch (error) {
    next(error);
  }
};*/

/*export const cambiarPassword = async (req, res, next) => {
  try {
    const { nuevaPassword } = req.body;
    if (!nuevaPassword || nuevaPassword.length < 6) {
      return res.status(400).json({ error: "La contraseña debe tener al menos 6 caracteres" });
    }

    const { error } = await supabase.auth.updateUser({ password: nuevaPassword });
    if (error) return res.status(400).json({ error: error.message });

    res.status(200).json({ mensaje: "Contraseña actualizada correctamente" });
  } catch (error) {
    next(error);
  }
};*/

// Listar usuarios
export const listarUsuarios = async (req, res, next) => {
  try {
    if (req.user.rol !== "super-usuario") {
      return res.status(403).json({ error: "No autorizado" });
    }

    const [empleados, pasajeros] = await Promise.all([
      userService.listarUsers(),
      pasajerosService.listarPasajeros(),
    ]);

    res.status(200).json({
      empleados,
      pasajeros,
    });
  } catch (error) {
    next(error);
  }
};
