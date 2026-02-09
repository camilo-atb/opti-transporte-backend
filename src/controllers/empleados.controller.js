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
    console.log("BODY RECIBIDO:", req.body);

    const { email, password, nombre, apellido, telefono, rol, ruta_imagen } = req.body;

    if (!email || !password || !nombre || !rol) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      console.error("SUPABASE ERROR:", error);
      return res.status(400).json({ error: error.message });
    }

    if (!data?.user?.id) {
      return res.status(500).json({ error: "No se pudo obtener el ID del usuario" });
    }

    const newUser = await userService.crearUser(
      data.user.id,
      nombre,
      apellido,
      telefono,
      rol,
      ruta_imagen
    );

    return res.status(201).json({
      mensaje: "Usuario creado correctamente",
      user: newUser,
    });
  } catch (error) {
    console.error("ERROR CREATE USER:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Actualizar usuario
export const updateUser = async (req, res, next) => {
  try {
    const { id_auth_supabase } = req.params;
    const requester = req.user;


    console.log("DEBUG - Requester:", requester);
    console.log("DEBUG - Body recibido:", req.body);

    if (!requester) {
      return res.status(401).json({ error: "No se pudo identificar al usuario que realiza la petición" });
    }

    if (requester.rol !== "super-usuario" && requester.id !== id_auth_supabase) {
      return res.status(403).json({ error: "No tienes permiso" });
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
    console.error("DETALLE DEL ERROR 500:", error);
    res.status(500).json({
      error: "Error interno",
      details: error.message,
    });
  }
};

export const desactivarCuenta = async (req, res, next) => {
  try {
    const { id_auth_supabase, tipo } = req.params;
    const { estado } = req.body; // 👈 ahora dinámico

    if (!estado) {
      return res.status(400).json({ error: "Estado requerido" });
    }

    let result;

    if (tipo === "empleado") {
      result = await userService.cambiarEstado(
          id_auth_supabase,
          estado
      );
    } else if (tipo === "pasajero") {
        result = await pasajerosService.cambiarEstado(
          id_auth_supabase,
          estado
      );
    } else {
      return res.status(400).json({ error: "Tipo inválido" });
    }

    if (!result) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.status(200).json({
      mensaje: `Cuenta ${estado}`,
      usuario: result,
    });
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
/*export const listarUsuarios = async (req, res, next) => {
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
};*/

//Listar usuarios
export const listarUsuarios = async (req, res, next) => {
  try {
    if (req.user.rol !== "super-usuario") {
      return res.status(403).json({ error: "No autorizado" });
    }

    const empleados = await userService.listarUsersPorEstado();

    res.status(200).json({
      empleadosActivos: empleados.activos,
      empleadosInactivos: empleados.inactivos,
    });
  } catch (error) {
    next(error);
  }
};
