import { getConnection } from "../config/db.js";
import sql from "mssql";

class PreguntasFrecuentesService {
  constructor() {
    this.table = "preguntas_frecuentes";
  }

  // Crear FAQ
  async create(pregunta, respuesta) {
    const pool = await getConnection();

    const result = await pool.request()
      .input("pregunta", sql.NVarChar, pregunta)
      .input("respuesta", sql.NVarChar, respuesta)
      .query(`
        INSERT INTO ${this.table} (pregunta, respuesta)
        OUTPUT INSERTED.*
        VALUES (@pregunta, @respuesta)
      `);

    return result.recordset[0];
  }

  // Editar FAQ
  async update(id, datos) {
    const pool = await getConnection();

    // Verificar existencia
    const existe = await pool.request()
      .input("id", sql.Int, id)
      .query(`SELECT * FROM ${this.table} WHERE id = @id`);

    if (existe.recordset.length === 0) {
      throw new Error(`No existe la pregunta con id ${id}`);
    }

    const actual = existe.recordset[0];

    const {
      pregunta = actual.pregunta,
      respuesta = actual.respuesta,
    } = datos;

    const result = await pool.request()
      .input("id", sql.Int, id)
      .input("pregunta", sql.NVarChar, pregunta)
      .input("respuesta", sql.NVarChar, respuesta)
      .query(`
        UPDATE ${this.table}
        SET
          pregunta = @pregunta,
          respuesta = @respuesta,
          fecha_modificacion = SYSDATETIME()
        OUTPUT INSERTED.*
        WHERE id = @id
      `);

    return result.recordset[0];
  }

  // Eliminar FAQ
  async delete(id) {
    const pool = await getConnection();

    const result = await pool.request()
      .input("id", sql.Int, id)
      .query(`
        DELETE FROM ${this.table}
        OUTPUT DELETED.*
        WHERE id = @id
      `);

    if (result.recordset.length === 0) {
      throw new Error(`No existe la pregunta con id ${id}`);
    }

    return { mensaje: "Pregunta eliminada correctamente" };
  }

  // Obtener todas las FAQ (paginadas)
  async getAll(page = 1, limit = 10) {
    const pool = await getConnection();
    const offset = (page - 1) * limit;

    const dataResult = await pool.request()
      .input("limit", sql.Int, limit)
      .input("offset", sql.Int, offset)
      .query(`
        SELECT *
        FROM ${this.table}
        ORDER BY fecha_publicacion DESC
        OFFSET @offset ROWS
        FETCH NEXT @limit ROWS ONLY
      `);

    const totalResult = await pool.request().query(`
      SELECT COUNT(*) AS total FROM ${this.table}
    `);

    const total = totalResult.recordset[0].total;

    return {
      data: dataResult.recordset,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }
}

const PreguntasFrecuentes = new PreguntasFrecuentesService();
export default PreguntasFrecuentes;
