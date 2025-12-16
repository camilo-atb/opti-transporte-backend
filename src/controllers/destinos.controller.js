import Destinos from "../services/destinos.service.js";
import usuario from "../services/empleado.service.js";

// Crear tarjeta (CARD)
export const crearCard = async (req, res, next) => {
  try {
    const requesterId = req.user.id;
    const requester = await usuario.mostrarUserPorIdSupabase(requesterId);

    if (!requester) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    const { imagen_url, nombre_destino, frase_introductoria } = req.body;

    if (!imagen_url || !nombre_destino || !frase_introductoria) {
      return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    const card = await Destinos.createCard(imagen_url, nombre_destino, frase_introductoria);
    res.status(201).json(card);
  } catch (error) {
    next(error);
  }
};

// Crear página (PAGE)
export const crearPage = async (req, res, next) => {
  try {
    const requesterId = req.user.id;
    const requester = await usuario.mostrarUserPorIdSupabase(requesterId);

    if (!requester) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    const { imagen_url, nombre_destino, contenido_page } = req.body;
    const { destinoId } = req.params;

    if (!imagen_url || !nombre_destino || !contenido_page) {
      return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    const page = await Destinos.createPage(imagen_url, nombre_destino, contenido_page, destinoId);
    res.status(201).json(page);
  } catch (error) {
    next(error);
  }
};

// Editar tarjeta
export const editarCard = async (req, res, next) => {
  try {
    const requesterId = req.user.id;
    const requester = await usuario.mostrarUserPorIdSupabase(requesterId);

    if (!requester) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }
    const { id } = req.params;
    const datos = req.body;

    const card = await Destinos.editCard(id, datos);
    res.json(card);
  } catch (error) {
    next(error);
  }
};

// Editar página
export const editarPage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const datos = req.body;

    const page = await Destinos.editPage(id, datos);
    res.json(page);
  } catch (error) {
    next(error);
  }
};

// Obtener todas las tarjetas
export const obtenerCards = async (req, res, next) => {
  try {
    const cards = await Destinos.getAllCards();
    res.json(cards);
  } catch (error) {
    next(error);
  }
};

// Obtener tarjeta y página
export const obtenerDestinoCompleto = async (req, res, next) => {
  try {
    const { id } = req.params;
    const destino = await Destinos.getDestinoCompleto(id);

    if (!destino) return res.status(404).json({ error: "Destino no encontrado" });

    res.json(destino);
  } catch (error) {
    next(error);
  }
};

// Eliminar tarjeta
export const eliminarCard = async (req, res, next) => {
  try {
    const requesterId = req.user.id;
    const requester = await usuario.mostrarUserPorIdSupabase(requesterId);

    if (!requester) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }
    const { id } = req.params;
    const resultado = await Destinos.deleteCard(id);
    res.json(resultado);
  } catch (error) {
    next(error);
  }
};
