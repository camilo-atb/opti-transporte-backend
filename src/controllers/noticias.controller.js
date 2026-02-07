import noticiasService from "../services/noticias.service.js";
import usuario from "../services/empleado.service.js";

// CREAR NOTICIA

const createNoticiaBySuper = async (req, res, next) => {
  try {
    const requesterId = req.user.id;
    const requester = await usuario.mostrarUserPorIdSupabase(requesterId);

    if (!requester) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const {
      titulo,
      resumen,
      contenido_principal,
      ruta_imagen,
      imagekit_file_id,
      autor,
      categoria,
    } = req.body;

    const newNotice = await noticiasService.crearNoticia(
      titulo,
      resumen,
      contenido_principal,
      ruta_imagen,
      imagekit_file_id,
      autor,
      categoria
    );

    res.status(201).json(newNotice);
  } catch (error) {
    next(error);
  }
};

// EDITAR NOTICIA

const modificarNoticia = async (req, res, next) => {
  try {
    const requesterId = req.user.id;
    const requester = await usuario.mostrarUserPorIdSupabase(requesterId);

    if (!requester) {
      return res.status(404).json({ error: "Usuario no encontrado en la base de datos" });
    }

    const id = Number(req.params.id);

    const updateNoticia = await noticiasService.editarNoticia(id, req.body);
    res.status(200).json(updateNoticia);
  } catch (error) {
    next(error);
  }
};

// ELIMINAR NOTICIA

const eliminarNoticias = async (req, res, next) => {
  try {
    const requesterId = req.user.id;
    const requester = await usuario.mostrarUserPorIdSupabase(requesterId);

    if (!requester) {
      return res.status(404).json({ error: "Usuario no encontrado en la base de datos" });
    }

    const { id } = req.params;
    await noticiasService.eliminarNoticia(id);

    res.status(200).json({ mensaje: "Noticia eliminada con éxito" });
  } catch (error) {
    next(error);
  }
};

// ÚLTIMAS NOTICIAS (HOME)
const obtenerUltimasNoticias = async (req, res, next) => {
  try {
    const limit = Number(req.query.limit) || 3;
    const noticias = await noticiasService.mostrarUltimasNoticias(limit);
    res.status(200).json(noticias);
  } catch (error) {
    next(error);
  }
};

// NOTICIAS PAGINADAS
const obtenerNoticiasPaginadas = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await noticiasService.mostrarNoticiasPaginadas(page, limit);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// NOTICIA COMPLETA POR ID
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
  obtenerUltimasNoticias,
  obtenerNoticiasPaginadas,
  obtenerNoticiaPorId,
};
