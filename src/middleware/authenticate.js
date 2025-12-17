import supabase from "../config/supabase.js";
import usuario from "../services/empleado.service.js";
import pasajerosService from "../services/pasajeros.service.js";

const authenticate = async (req, res, next) => {
  //Ver el header completo
  //console.log("AUTH HEADER:", req.headers.authorization);

  const token = req.headers.authorization?.split(" ")[1];
  console.log("API_KEY ENV:", process.env.API_KEY);
  console.log("HEADER:", req.headers["x-api-key"]);
  console.log("URL:", req.originalUrl);


  // Ver el token extraído
  //console.log("TOKEN:", token);

  if (!token) {
    return res.status(401).json({ error: "Sin autorización" });
  }
  console.log("API_KEY ENV:", process.env.API_KEY);
  console.log("HEADER:", req.headers["x-api-key"]);
  console.log("URL:", req.originalUrl);

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  
  // Ver respuesta de Supabase
  console.log("SUPABASE ERROR:", error);
  console.log("SUPABASE USER:", user);

  if (error || !user) {
    return res.status(401).json({ error: "Token inválido o usuario no autenticado" });
  }

  let userFromDb = await usuario.mostrarUserPorIdSupabase(user.id);

  if (!userFromDb) {
    userFromDb = await pasajerosService.mostrarPasajeroPorIdSupabase(user.id);
  }

  if (!userFromDb) {
    return res.status(403).json({ error: "Usuario no registrado en ninguna base local" });
  }

  req.user = {
    id: user.id,
    rol: userFromDb.rol,
    nombre: userFromDb.nombre,
    apellido: userFromDb.apellido,
    telefono: userFromDb.telefono,
  };

  next();
  
};

export default authenticate;
