import { getConnection } from "../config/db.js";
import sql from "mssql";

class TransparenciaService {
  constructor() {
    this.table = "transparencia";
  }

  // Crear nueva sección o subsección
  async create(titulo, slug, parentId = null, orden = 0) {
    const pool = await getConnection();

    // Validar slug único
    const slugCheck = await pool.request()
      .input("slug", sql.NVarChar, slug)
      .query(`
        SELECT id FROM ${this.table}
        WHERE slug = @slug
      `);

    if (slugCheck.recordset.length > 0) {
      throw new Error(`El slug "${slug}" ya está en uso.`);
    }

    const result = await pool.request()
      .input("titulo", sql.NVarChar, titulo)
      .input("slug", sql.NVarChar, slug)
      .input("parentId", sql.Int, parentId)
      .input("orden", sql.Int, orden)
      .query(`
        INSERT INTO ${this.table}
          (titulo, slug, parent_id, orden)
        OUTPUT INSERTED.*
        VALUES (@titulo, @slug, @parentId, @orden)
      `);

    return result.recordset[0];
  }

  // Obtener todas las secciones y subsecciones activas
  async getAll() {
    const pool = await getConnection();

    const result = await pool.request().query(`
      SELECT *
      FROM ${this.table}
      WHERE activo = 1
      ORDER BY parent_id, orden
    `);

    return result.recordset;
  }

  // Actualizar una sección o subsección
  async update(id, titulo, slug, orden) {
    const pool = await getConnection();

    const result = await pool.request()
      .input("id", sql.Int, id)
      .input("titulo", sql.NVarChar, titulo)
      .input("slug", sql.NVarChar, slug)
      .input("orden", sql.Int, orden)
      .query(`
        UPDATE ${this.table}
        SET
          titulo = @titulo,
          slug = @slug,
          orden = @orden,
          fecha_modificacion = SYSDATETIME()
        OUTPUT INSERTED.*
        WHERE id = @id AND activo = 1
      `);

    if (result.recordset.length === 0) {
      throw new Error(`No existe una sección activa con id ${id}`);
    }

    return result.recordset[0];
  }

  // Eliminación lógica (desactivar)
  async softDelete(id) {
    const pool = await getConnection();

    const result = await pool.request()
      .input("id", sql.Int, id)
      .query(`
        UPDATE ${this.table}
        SET
          activo = 0,
          fecha_modificacion = SYSDATETIME()
        WHERE id = @id
      `);

    if (result.rowsAffected[0] === 0) {
      throw new Error(`No existe ninguna sección con id ${id}`);
    }

    return { mensaje: `Sección con id ${id} desactivada correctamente.` };
  }
}

const Transparencia = new TransparenciaService();
export default Transparencia;