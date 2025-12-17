import { getConnection } from "../config/db.js";
import sql from "mssql";

class LogosService {
  constructor() {
    this.table = "logos";
  }

  // Crear logo
  async create(imagen_url, empresa_url, alt_text, title) {
    const pool = await getConnection();

    const result = await pool.request()
      .input("imagen_url", sql.NVarChar, imagen_url)
      .input("empresa_url", sql.NVarChar, empresa_url)
      .input("alt_text", sql.NVarChar, alt_text)
      .input("title", sql.NVarChar, title)
      .query(`
        INSERT INTO ${this.table}
          (imagen_url, empresa_url, alt_text, title)
        OUTPUT INSERTED.*
        VALUES (@imagen_url, @empresa_url, @alt_text, @title)
      `);

    return result.recordset[0];
  }

  // Obtener todos los logos activos
  async getAll() {
    const pool = await getConnection();

    const result = await pool.request().query(`
      SELECT *
      FROM ${this.table}
      WHERE activo = 1
      ORDER BY fecha_publicacion DESC
    `);

    return result.recordset;
  }

  // Obtener un logo por ID
  async getById(id) {
    const pool = await getConnection();

    const result = await pool.request()
      .input("id", sql.Int, id)
      .query(`
        SELECT *
        FROM ${this.table}
        WHERE id = @id
      `);

    return result.recordset[0];
  }

  // Actualizar logo (dinámico)
  async update(id, camposActualizados) {
    const pool = await getConnection();

    const columnas = Object.keys(camposActualizados);

    if (columnas.length === 0) {
      throw new Error("No hay campos para actualizar.");
    }

    // Construcción dinámica segura
    const setQuery = columnas
      .map((col, index) => `${col} = @valor${index}`)
      .join(", ");

    const request = pool.request();

    columnas.forEach((col, index) => {
      request.input(`valor${index}`, sql.NVarChar, camposActualizados[col]);
    });

    request.input("id", sql.Int, id);

    const result = await request.query(`
      UPDATE ${this.table}
      SET ${setQuery},
          fecha_modificacion = SYSDATETIME()
      OUTPUT INSERTED.*
      WHERE id = @id
    `);

    return result.recordset[0];
  }

  // Eliminación lógica (soft delete)
  async softDelete(id) {
    const pool = await getConnection();

    const result = await pool.request()
      .input("id", sql.Int, id)
      .query(`
        UPDATE ${this.table}
        SET activo = 0,
            fecha_modificacion = SYSDATETIME()
        OUTPUT INSERTED.*
        WHERE id = @id
      `);

    return result.recordset[0];
  }
}

const Logos = new LogosService();
export default Logos;