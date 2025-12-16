import supabase from "../config/supabase.js";
import userService from "../services/empleado.service.js";

// Inicio de sesión empleados o superusuario
const signInEmpleado = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) return res.status(400).json({ error: error.message });

    const usuario = await userService.mostrarUserPorIdSupabase(data.user.id);
    if (!usuario) return res.status(404).json({ error: "Usuario no encontrado en la base local" });

    res.status(200).json({
      session: data.session,
      rol: usuario.rol,
      usuario,
    });
  } catch (error) {
    next(error);
  }
};

export default { signInEmpleado };
