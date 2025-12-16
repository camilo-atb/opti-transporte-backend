import pool from "../config/db.js";

class PreguntasFrecuentesService {
  constructor() {
    this.table = "preguntas_frecuentes";
  }

  // Crear FAQ
  async create(pregunta, respuesta) {
    const { rows } = await pool.query(
      `INSERT INTO ${this.table} (pregunta, respuesta)
             VALUES ($1, $2)
             RETURNING *`,
      [pregunta, respuesta]
    );
    return rows[0];
  }

  // Editar FAQ
  async update(id, datos) {
    const obtenerFAQ = await pool.query(`SELECT * FROM ${this.table} WHERE id = $1`, [id]);

    if (obtenerFAQ.rowCount === 0) {
      throw new Error(`No existe la pregunta con id ${id}`);
    }

    const actual = obtenerFAQ.rows[0];

    const { pregunta = actual.pregunta, respuesta = actual.respuesta } = datos;

    const { rows } = await pool.query(
        `UPDATE ${this.table}
        SET pregunta = $1, respuesta = $2, fecha_modificacion = NOW()
        WHERE id = $3
        RETURNING *`,
      [pregunta, respuesta, id]
    );

    return rows[0];
  }

  // Eliminar FAQ
  async delete(id) {
    const obtenerFAQ = await pool.query(`SELECT * FROM ${this.table} WHERE id = $1`, [id]);

    if (obtenerFAQ.rowCount === 0) {
      throw new Error(`No existe la pregunta con id ${id}`);
    }

    await pool.query(`DELETE FROM ${this.table} WHERE id = $1`, [id]);
    return { mensaje: "Pregunta eliminada correctamente" };
  }

  // Obtener todas las FAQ

  async getAll(page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    const { rows } = await pool.query(
      `SELECT * FROM ${this.table}
      ORDER BY fecha_publicacion DESC
      LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    const total = await pool.query(
      `SELECT COUNT(*) FROM preguntas_frecuentes`
    );

    return {
      data: rows,
      total: Number(total.rows[0].count),
      page,
      totalPages: Math.ceil(total.rows[0].count / limit),
    };
  }
  }

const PreguntasFrecuentes = new PreguntasFrecuentesService();
export default PreguntasFrecuentes;
