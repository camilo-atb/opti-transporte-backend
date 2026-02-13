import Transparencia from "../services/transparencia.service.js";
import usuario from "../services/empleado.service.js";

// Crear sección o subsección
const createSeccionBySuper = async (req, res, next) => {
  try {
    const requesterId = req.user.id;
    const requester = await usuario.mostrarUserPorIdSupabase(requesterId);

    if (!requester) {
      return res.status(404).json({ error: "Usuario no encontrado en la base de datos" });
    }

    const { titulo, slug, parent_id, orden } = req.body;

    const nuevaSeccion = await Transparencia.create(titulo, slug, parent_id, orden);
    res.status(201).json(nuevaSeccion);
  } catch (error) {
    next(error);
  }
};

// Obtener estructura completa de transparencia
const getEstructuraTransparencia = async (_, res, next) => {
  try {
    const estructura = await Transparencia.getAll();
    res.status(200).json(estructura);
  } catch (error) {
    next(error);
  }
};

const updateSeccionBySuper = async (req, res, next) => {
  try {
    const requesterId = req.user.id;
    const requester = await usuario.mostrarUserPorIdSupabase(requesterId);

    if (!requester) {
      return res.status(404).json({ error: "Usuario no encontrado en la base de datos" });
    }

    const { id } = req.params;
    const { titulo, slug, orden } = req.body;

    const seccionActualizada = await Transparencia.update(id, titulo, slug, orden);
    res.status(200).json(seccionActualizada);
  } catch (error) {
    next(error);
  }
};

// Eliminación lógica
const deleteSeccionBySuper = async (req, res, next) => {
  try {
    const requesterId = req.user.id;
    const requester = await usuario.mostrarUserPorIdSupabase(requesterId);

    if (!requester) {
      return res.status(404).json({ error: "Usuario no encontrado en la base de datos" });
    }

    const { id } = req.params;
    const result = await Transparencia.softDelete(id);

    res.status(200).json({ message: result });
  } catch (error) {
    next(error);
  }
};

// Obtener contenido por sección
const getContenidoBySeccion = async (req, res, next) => {
  try {
    const { id } = req.params;

    const contenido = await Transparencia.getContenidoBySeccion(id);

    res.status(200).json(contenido);
  } catch (error) {
    next(error);
  }
};

// Obtener archivos por sección
const getArchivosBySeccion = async (req, res, next) => {
  try {
    const { id } = req.params;

    const archivos = await Transparencia.getArchivosBySeccion(id);

    res.status(200).json(archivos);
  } catch (error) {
    next(error);
  }
};

const createContenidoBySuper = async (req, res, next) => {
  try {
    const requesterId = req.user.id;
    const requester = await usuario.mostrarUserPorIdSupabase(requesterId);

    if (!requester) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const { id } = req.params;
    const { contenido } = req.body;

    const nuevo = await Transparencia.createContenido(id, contenido);

    res.status(201).json(nuevo);
  } catch (error) {
    next(error);
  }
};

const updateContenidoBySuper = async (req, res, next) => {
  try {
    const requesterId = req.user.id;
    const requester = await usuario.mostrarUserPorIdSupabase(requesterId);

    if (!requester) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const { id } = req.params;
    const { contenido } = req.body;

    const actualizado = await Transparencia.updateContenido(id, contenido);

    res.status(200).json(actualizado);
  } catch (error) {
    next(error);
  }
};

const deleteContenidoBySuper = async (req, res, next) => {
  try {
    const requesterId = req.user.id;
    const requester = await usuario.mostrarUserPorIdSupabase(requesterId);

    if (!requester) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const { id } = req.params;

    const result = await Transparencia.deleteContenido(id);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const createArchivoBySuper = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { titulo, url } = req.body;

    if (!url) {
      return res.status(400).json({ error: "URL del archivo requerida" });
    }

    const archivo = await Transparencia.createArchivo(id, titulo, url);

    res.status(201).json(archivo);
  } catch (error) {
    next(error);
  }
};

const deleteArchivoBySuper = async (req, res, next) => {
  try {
    const requesterId = req.user.id;
    const requester = await usuario.mostrarUserPorIdSupabase(requesterId);

    if (!requester) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const { id } = req.params;

    const result = await Transparencia.deleteArchivo(id);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// Obtener estructura pública completa
const getEstructuraPublica = async (req, res, next) => {
  try {
    const data = await Transparencia.getEstructuraPublica();
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export default {
  createSeccionBySuper,
  getEstructuraTransparencia,
  updateSeccionBySuper,
  deleteSeccionBySuper,
  getContenidoBySeccion,
  getArchivosBySeccion,
  createContenidoBySuper,
  updateContenidoBySuper,
  deleteContenidoBySuper,
  createArchivoBySuper,
  deleteArchivoBySuper,
  getEstructuraPublica,
};
