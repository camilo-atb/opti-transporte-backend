import supabaseEmpleados from "../config/supabase.empleados.js";
import userService from "../services/empleado.service.js";

// Inicio de sesión empleados o superusuario
const signInEmpleado = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const { data, error } = await supabaseEmpleados.auth.signInWithPassword({
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
    console.log("SESSION:", data.session);
    console.log("ACCESS TOKEN:", data.session?.access_token);
  } catch (error) {
    next(error);
  }
};

export default { signInEmpleado };
