import { getConnection } from "../config/db.js";
import sql from "mssql";

class OpinionesService {
  constructor() {
    this.tableOpiniones = "opiniones";
    this.tableUsuarios = "usuarios_pasajeros";
  }

  // Crear una opinión
  async createOpinion(userId, data) {
    const { puntuacion, tituloOpinion, opinion } = data;

    if (!puntuacion || !opinion) {
      throw new Error("Faltan campos obligatorios");
    }

    const pool = await getConnection();

    const result = await pool
      .request()
      .input("userId", sql.Int, userId)
      .input("puntuacion", sql.SmallInt, puntuacion)
      .input("titulo", sql.NVarChar, tituloOpinion || null)
      .input("opinion", sql.NVarChar, opinion).query(`
        INSERT INTO ${this.tableOpiniones}
          (user_id, puntuacion, titulo_opinion, opinion)
        OUTPUT INSERTED.*
        VALUES (@userId, @puntuacion, @titulo, @opinion)
      `);

    return result.recordset[0];
  }

  // Obtener todas las opiniones
  async getOpiniones(aprobadas = true) {
    const pool = await getConnection();

    const result = await pool.request().query(`
      SELECT 
        o.id,
        o.puntuacion,
        o.titulo_opinion,
        o.opinion,
        o.aprobado,
        o.fecha_publicacion,
        o.fecha_modificacion,
        u.nombre,
        u.apellido,
        u.ruta_imagen
      FROM ${this.tableOpiniones} o
      INNER JOIN ${this.tableUsuarios} u ON o.user_id = u.id
      ${aprobadas ? "WHERE o.aprobado = 1" : ""}
      ORDER BY o.fecha_publicacion DESC
    `);

    return result.recordset;
  }

  // Obtener una sola opinión por ID
  async getOpinionById(id) {
    const pool = await getConnection();

    const result = await pool.request().input("id", sql.Int, id).query(`
        SELECT 
          o.*,
          u.nombre,
          u.apellido,
          u.ruta_imagen
        FROM ${this.tableOpiniones} o
        INNER JOIN ${this.tableUsuarios} u ON o.user_id = u.id
        WHERE o.id = @id
      `);

    return result.recordset[0];
  }

  // Actualizar una opinión
  async updateOpinion(idOpinion, data) {
    const { puntuacion, tituloOpinion, opinion, aprobado } = data;

    const pool = await getConnection();

    const result = await pool
      .request()
      .input("puntuacion", sql.SmallInt, puntuacion ?? null)
      .input("titulo", sql.NVarChar, tituloOpinion ?? null)
      .input("opinion", sql.NVarChar, opinion ?? null)
      .input("aprobado", sql.Bit, aprobado ?? null)
      .input("id", sql.Int, idOpinion).query(`
        UPDATE ${this.tableOpiniones}
        SET 
          puntuacion = COALESCE(@puntuacion, puntuacion),
          titulo_opinion = COALESCE(@titulo, titulo_opinion),
          opinion = COALESCE(@opinion, opinion),
          aprobado = COALESCE(@aprobado, aprobado),
          fecha_modificacion = SYSDATETIME()
        OUTPUT INSERTED.*
        WHERE id = @id
      `);

    if (result.recordset.length === 0) {
      throw new Error("Opinión no encontrada");
    }

    return result.recordset[0];
  }

  // Eliminar una opinión
  async deleteOpinion(idOpinion) {
    const pool = await getConnection();

    const result = await pool.request().input("id", sql.Int, idOpinion).query(`
        DELETE FROM ${this.tableOpiniones}
        OUTPUT DELETED.*
        WHERE id = @id
      `);

    if (result.recordset.length === 0) {
      throw new Error("Opinión no encontrada");
    }

    return {
      mensaje: "Opinión eliminada correctamente",
      opinion: result.recordset[0],
    };
  }
}

export default new OpinionesService();
