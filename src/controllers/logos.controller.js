import Logos from "../services/logos.service.js";
import usuario from "../services/empleado.service.js";

// Crear logo (solo superusuario)
const crearLogoBySuper = async (req, res, next) => {
  try {
    const requesterId = req.user.id;
    const requester = await usuario.mostrarUserPorIdSupabase(requesterId);

    if (!requester) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    const {
      imagen_url,
      empresa_url,
      alt_text,
      title,
      imagekit_file_id
    } = req.body;

    const newLogo = await Logos.create(
      imagen_url,
      empresa_url,
      alt_text,
      title,
      imagekit_file_id
    );

    res.status(201).json(newLogo);
  } catch (error) {
    next(error);
  }
};

// Obtener todos los logos activos
const getLogos = async (_, res, next) => {
  try {
    const allLogos = await Logos.getAll();
    res.status(200).json(allLogos);
  } catch (error) {
    next(error);
  }
};

// Obtener logo por ID
const getLogoById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const logo = await Logos.getById(id);

    if (!logo) {
      return res.status(404).json({ error: "Logo no encontrado." });
    }

    res.status(200).json(logo);
  } catch (error) {
    next(error);
  }
};

// Actualizar logo (solo superusuario)
const updateLogoBySuper = async (req, res, next) => {
  try {
    const requesterId = req.user.id;
    const requester = await usuario.mostrarUserPorIdSupabase(requesterId);

    if (!requester) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    const { id } = req.params;
    const camposActualizados = req.body;

    const updatedLogo = await Logos.update(id, camposActualizados);
    res.status(200).json(updatedLogo);
  } catch (error) {
    next(error);
  }
};

// Eliminación lógica (solo superusuario)
const deleteLogoBySuper = async (req, res, next) => {
  try {
    const requesterId = req.user.id;
    const requester = await usuario.mostrarUserPorIdSupabase(requesterId);

    if (!requester) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    const { id } = req.params;
    const deletedLogo = await Logos.softDelete(id);

    res.status(200).json(deletedLogo);
  } catch (error) {
    next(error);
  }
};

// Activar logo
const activarLogoBySuper = async (req, res, next) => {
  try {
    const requesterId = req.user.id;
    const requester = await usuario.mostrarUserPorIdSupabase(requesterId);

    if (!requester) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    const { id } = req.params;
    const activatedLogo = await Logos.activate(id);

    res.status(200).json(activatedLogo);
  } catch (error) {
    next(error);
  }
};


export default {
  crearLogoBySuper,
  getLogos,
  getLogoById,
  updateLogoBySuper,
  deleteLogoBySuper,
  activarLogoBySuper
};