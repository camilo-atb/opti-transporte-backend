import pool from "../config/db.js";

class LogosService {
  constructor() {
    this.table = "logos";
  }

  // Crear logo
  async create(imagen_url, empresa_url, alt_text, title) {
    const { rows } = await pool.query(
      `INSERT INTO ${this.table} 
            (imagen_url, empresa_url, alt_text, title)
            VALUES ($1, $2, $3, $4)
            RETURNING *`,
      [imagen_url, empresa_url, alt_text, title]
    );
    return rows[0];
  }

  // Obtener todos los logos activos
  async getAll() {
    const { rows } = await pool.query(
      `SELECT * FROM ${this.table} 
             WHERE activo = TRUE 
             ORDER BY fecha_publicacion DESC`
    );
    return rows;
  }

  // Obtener un logo por ID
  async getById(id) {
    const { rows } = await pool.query(`SELECT * FROM ${this.table} WHERE id = $1`, [id]);
    return rows[0];
  }

  // Actualizar logo
  async update(id, camposActualizados) {
    const columnas = Object.keys(camposActualizados);
    const valores = Object.values(camposActualizados);

    if (columnas.length === 0) throw new Error("No hay campos para actualizar.");

    const setQuery = columnas.map((columna, index) => `${columna} = $${index + 1}`).join(", ");

    const query = `
            UPDATE ${this.table}
            SET ${setQuery}, fecha_modificacion = NOW()
            WHERE id = $${columnas.length + 1}
            RETURNING *;
        `;

    const { rows } = await pool.query(query, [...valores, id]);
    return rows[0];
  }

  // Eliminación lógica (marcar como inactivo)
  async softDelete(id) {
    const { rows } = await pool.query(
        `UPDATE ${this.table}
        SET activo = FALSE, fecha_modificacion = NOW()
        WHERE id = $1
        RETURNING *`,
      [id]
    );
    return rows[0];
  }
}

const Logos = new LogosService();
export default Logos;
