import pool from "../config/db.js";

class Destinos {
  constructor() {
    this.tableCard = "destinos_card";
    this.tablePage = "destinos_page";
  }

  // Crear una tarjeta
  async createCard(rutaImagen, nombreDestino, fraseIntroductoria) {
    const { rows } = await pool.query(
      `INSERT INTO ${this.tableCard} (imagen_url, nombre_destino, frase_introductoria)
      VALUES ($1, $2, $3)
      RETURNING *`,
      [rutaImagen, nombreDestino, fraseIntroductoria]
    );
    return rows[0];
  }

  // Crear una página asociada
  async createPage(rutaImagen, nombreDestino, contenidoPage, destinoId) {
    const { rows } = await pool.query(
      `INSERT INTO ${this.tablePage} (imagen_url, nombre_destino, contenido_page, destino_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *`,
      [rutaImagen, nombreDestino, contenidoPage, destinoId]
    );
    return rows[0];
  }

  // Editar una tarjeta
  async editCard(id, datos) {
    const obtenerCard = await pool.query(`SELECT * FROM ${this.tableCard} WHERE id = $1`, [id]);

    if (obtenerCard.rowCount === 0) {
      throw new Error(`No existe la carta con id ${id}`);
    }

    const card = obtenerCard.rows[0];

    const {
      rutaImagen = card.imagen_url,
      nombreDestino = card.nombre_destino,
      fraseIntroductoria = card.frase_introductoria,
    } = datos;

    const { rows } = await pool.query(
      `UPDATE ${this.tableCard}
      SET imagen_url = $1,
      nombre_destino = $2,
      frase_introductoria = $3,
      fecha_modificacion = NOW()
      WHERE id = $4
      RETURNING *`,
      [rutaImagen, nombreDestino, fraseIntroductoria, id]
    );

    return rows[0];
  }

  async editPage(id, datos) {
    const obtenerPage = await pool.query(`SELECT * FROM destinos_page WHERE id = $1`, [id]);

    if (obtenerPage.rowCount === 0) {
      throw new Error(`No existe la página con id ${id}`);
    }

    const page = obtenerPage.rows[0];

    const {
      imagen_url = page.imagen_url,
      nombre_destino = page.nombre_destino,
      contenido_page = page.contenido_page,
    } = datos;

    const { rows } = await pool.query(
      `UPDATE destinos_page
        SET imagen_url = $1,
            nombre_destino = $2,
            contenido_page = $3,
            fecha_modificacion = NOW()
        WHERE id = $4
        RETURNING *`,
      [imagen_url, nombre_destino, contenido_page, id]
    );

    return rows[0];
  }

  // Obtener todas las tarjetas
  async getAllCards() {
    const { rows } = await pool.query(
      `SELECT * FROM ${this.tableCard} WHERE activo = TRUE ORDER BY fecha_publicacion DESC`
    );
    return rows;
  }

  // Obtener una tarjeta con su página
  async getDestinoCompleto(id) {
    const { rows } = await pool.query(
      `SELECT c.*, p.contenido_page
            FROM ${this.tableCard} c
            LEFT JOIN ${this.tablePage} p ON c.id = p.destino_id
            WHERE c.id = $1`,
      [id]
    );
    return rows[0];
  }

  // Eliminar tarjeta
  async deleteCard(id) {
    const { rowCount } = await pool.query(`DELETE FROM ${this.tableCard} WHERE id = $1`, [id]);

    if (rowCount === 0) {
      throw new Error(`No existe la carta con id ${id}`);
    }

    return { message: "Destino eliminado correctamente" };
  }
}

export default new Destinos();
