import { getConnection } from "../config/db.js";
import sql from "mssql";

class Destinos {
  constructor() {
    this.tableCard = "destinos_card";
    this.tablePage = "destinos_page";
  }

  // Crear tarjeta
  async createCard(rutaImagen, nombreDestino, fraseIntroductoria) {
    const pool = await getConnection();

    const result = await pool
      .request()
      .input("imagen_url", sql.NVarChar, rutaImagen)
      .input("nombre_destino", sql.NVarChar, nombreDestino)
      .input("frase_introductoria", sql.NVarChar, fraseIntroductoria).query(`
        INSERT INTO ${this.tableCard} (imagen_url, nombre_destino, frase_introductoria)
        OUTPUT INSERTED.*
        VALUES (@imagen_url, @nombre_destino, @frase_introductoria)
      `);

    return result.recordset[0];
  }

  // Crear página
  async createPage(rutaImagen, nombreDestino, contenidoPage, destinoId) {
    const pool = await getConnection();

    const result = await pool
      .request()
      .input("imagen_url", sql.NVarChar, rutaImagen)
      .input("nombre_destino", sql.NVarChar, nombreDestino)
      .input("contenido_page", sql.NVarChar, contenidoPage)
      .input("destino_id", sql.Int, destinoId).query(`
        INSERT INTO ${this.tablePage} (imagen_url, nombre_destino, contenido_page, destino_id)
        OUTPUT INSERTED.*
        VALUES (@imagen_url, @nombre_destino, @contenido_page, @destino_id)
      `);

    return result.recordset[0];
  }

  // Editar tarjeta
  async editCard(id, datos) {
    const pool = await getConnection();

    const actual = await pool
      .request()
      .input("id", sql.Int, id)
      .query(`SELECT * FROM ${this.tableCard} WHERE id = @id`);

    if (actual.recordset.length === 0) {
      throw new Error(`No existe la tarjeta con id ${id}`);
    }

    const card = actual.recordset[0];

    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .input("imagen_url", sql.NVarChar, datos.rutaImagen ?? card.imagen_url)
      .input("nombre_destino", sql.NVarChar, datos.nombreDestino ?? card.nombre_destino)
      .input(
        "frase_introductoria",
        sql.NVarChar,
        datos.fraseIntroductoria ?? card.frase_introductoria
      ).query(`
        UPDATE ${this.tableCard}
        SET imagen_url = @imagen_url,
            nombre_destino = @nombre_destino,
            frase_introductoria = @frase_introductoria,
            fecha_modificacion = SYSDATETIME()
        OUTPUT INSERTED.*
        WHERE id = @id
      `);

    return result.recordset[0];
  }

  // Editar página
  async editPage(id, datos) {
    const pool = await getConnection();

    const actual = await pool
      .request()
      .input("id", sql.Int, id)
      .query(`SELECT * FROM ${this.tablePage} WHERE id = @id`);

    if (actual.recordset.length === 0) {
      throw new Error(`No existe la página con id ${id}`);
    }

    const page = actual.recordset[0];

    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .input("imagen_url", sql.NVarChar, datos.imagen_url ?? page.imagen_url)
      .input("nombre_destino", sql.NVarChar, datos.nombre_destino ?? page.nombre_destino)
      .input("contenido_page", sql.NVarChar, datos.contenido_page ?? page.contenido_page).query(`
        UPDATE ${this.tablePage}
        SET imagen_url = @imagen_url,
            nombre_destino = @nombre_destino,
            contenido_page = @contenido_page,
            fecha_modificacion = SYSDATETIME()
        OUTPUT INSERTED.*
        WHERE id = @id
      `);

    return result.recordset[0];
  }

  // Obtener tarjetas
  async getAllCards() {
    const pool = await getConnection();

    const result = await pool.request().query(`
      SELECT * FROM ${this.tableCard}
      WHERE activo = 1
      ORDER BY fecha_publicacion DESC
    `);

    return result.recordset;
  }

  // Obtener destino completo
  async getDestinoCompleto(id) {
    const pool = await getConnection();

    const result = await pool.request().input("id", sql.Int, id).query(`
        SELECT c.*, p.contenido_page
        FROM ${this.tableCard} c
        LEFT JOIN ${this.tablePage} p ON c.id = p.destino_id
        WHERE c.id = @id
      `);

    return result.recordset[0];
  }

  // Eliminar tarjeta
  async deleteCard(id) {
    const pool = await getConnection();

    const result = await pool.request().input("id", sql.Int, id).query(`
        DELETE FROM ${this.tableCard}
        WHERE id = @id
      `);

    if (result.rowsAffected[0] === 0) {
      throw new Error(`No existe la tarjeta con id ${id}`);
    }

    return { message: "Destino eliminado correctamente" };
  }
}

export default new Destinos();
