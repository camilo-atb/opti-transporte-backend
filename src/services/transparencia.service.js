import pool from "../config/db.js";

class TransparenciaService {
  constructor() {
    this.table = "transparencia";
  }

  // Crear nueva sección o subsección
  async create(titulo, slug, parentId = null, orden = 0) {
    // Validar slug único
    const slugResult = await pool.query(`SELECT id FROM ${this.table} WHERE slug = $1`, [slug]);

    if (slugResult.rowCount > 0) {
      throw new Error(`El slug "${slug}" ya está en uso.`);
    }

    const { rows } = await pool.query(
      `INSERT INTO ${this.table} 
            (titulo, slug, parent_id, orden)
            VALUES ($1, $2, $3, $4)
            RETURNING *`,
      [titulo, slug, parentId, orden]
    );

    return rows[0];
  }

  // Obtener todas las secciones y subsecciones activas
  async getAll() {
    const { rows } = await pool.query(
      `SELECT * FROM ${this.table}
      WHERE activo = TRUE
      ORDER BY parent_id, orden`
    );
    return rows;
  }

  // Actualizar una sección o subsección
  async update(id, titulo, slug, orden) {
    const { rows } = await pool.query(
        `UPDATE ${this.table}
        SET titulo = $1, slug = $2, orden = $3, fecha_modificacion = NOW()
        WHERE id = $4 AND activo = TRUE
        RETURNING *`,
      [titulo, slug, orden, id]
    );

    if (!rows.length) {
      throw new Error(`No existe una sección activa con id ${id}`);
    }

    return rows[0];
  }

  // Eliminación lógica (desactivar)
  async softDelete(id) {
    const { rowCount } = await pool.query(
        `UPDATE ${this.table}
        SET activo = FALSE, fecha_modificacion = NOW()
        WHERE id = $1`,
      [id]
    );

    if (!rowCount) {
      throw new Error(`No existe ninguna sección con id ${id}`);
    }

    return `Sección con id ${id} desactivada correctamente.`;
  }
}

const Transparencia = new TransparenciaService();
export default Transparencia;
