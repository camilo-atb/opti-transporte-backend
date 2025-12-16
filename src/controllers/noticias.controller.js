import noticiasService from "../services/noticias.service.js";
import usuario from "../services/empleado.service.js";

// Crear noticia
const createNoticiaBySuper = async (req, res, next) => {
  try {
    const requesterId = req.user.id;
    const requester = await usuario.mostrarUserPorIdSupabase(requesterId);

    if (!requester) {
      return res.status(404).json({ error: "Usuario no encontrado en la base de datos" });
    }

    const { titulo, resumen, contenido_principal, ruta_imagen, autor, categoria } = req.body;

    const newNotice = await noticiasService.crearNoticia(
      titulo,
      resumen,
      contenido_principal,
      ruta_imagen,
      autor,
      categoria
    );

    res.status(201).json(newNotice);
  } catch (error) {
    next(error);
  }
};

// Editar noticia
const modificarNoticia = async (req, res, next) => {
  try {
    const requesterId = req.user.id;
    const requester = await usuario.mostrarUserPorIdSupabase(requesterId);

    if (!requester) {
      return res.status(404).json({ error: "Usuario no encontrado en la base de datos" });
    }

    const { id } = req.params;
    const { titulo, resumen, contenido_principal, ruta_imagen, autor, categoria } = req.body;

    const updateNoticia = await noticiasService.editarNoticia(id, {
      titulo,
      resumen,
      contenido_principal,
      ruta_imagen,
      autor,
      categoria,
    });

    res.status(200).json(updateNoticia);
  } catch (error) {
    next(error);
  }
};

// Eliminar noticia
const eliminarNoticias = async (req, res, next) => {
  try {
    const requesterId = req.user.id;
    const requester = await usuario.mostrarUserPorIdSupabase(requesterId);

    if (!requester) {
      return res.status(404).json({ error: "Usuario no encontrado en la base de datos" });
    }

    const { idNoticia } = req.params;
    await noticiasService.eliminarNoticia(idNoticia);

    res.status(200).json({ mensaje: "Noticia eliminada con éxito" });
  } catch (error) {
    next(error);
  }
};

// Obtener todas las noticias (solo cards)
const obtenerNoticiasCards = async (req, res, next) => {
  try {
    const getNoticias = await noticiasService.mostrarNoticiasCards();
    res.status(200).json(getNoticias);
  } catch (error) {
    next(error);
  }
};

// Obtener noticia completa por ID
const obtenerNoticiaPorId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const noticia = await noticiasService.mostrarNoticiaPorId(id);
    res.status(200).json(noticia);
  } catch (error) {
    next(error);
  }
};

export default {
  createNoticiaBySuper,
  modificarNoticia,
  eliminarNoticias,
  obtenerNoticiasCards,
  obtenerNoticiaPorId,
};
