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
    const slugCheck = await pool.request().input("slug", sql.NVarChar, slug).query(`
        SELECT id FROM ${this.table}
        WHERE slug = @slug
      `);

    if (slugCheck.recordset.length > 0) {
      throw new Error(`El slug "${slug}" ya está en uso.`);
    }

    const result = await pool
      .request()
      .input("titulo", sql.NVarChar, titulo)
      .input("slug", sql.NVarChar, slug)
      .input("parentId", sql.Int, parentId)
      .input("orden", sql.Int, orden).query(`
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

    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .input("titulo", sql.NVarChar, titulo)
      .input("slug", sql.NVarChar, slug)
      .input("orden", sql.Int, orden).query(`
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

    const result = await pool.request().input("id", sql.Int, id).query(`
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

  // Obtener contenido de una sección
  async getContenidoBySeccion(transparenciaId) {
    const pool = await getConnection();

    const result = await pool.request().input("id", sql.Int, transparenciaId).query(`
        SELECT *
        FROM transparencia_contenido
        WHERE transparencia_id = @id
      `);

    return result.recordset[0] || null;
  }

  // Crear contenido
  async createContenido(transparenciaId, contenido) {
    const pool = await getConnection();

    const result = await pool.request()
      .input("transparenciaId", sql.Int, transparenciaId)
      .input("contenido", sql.NVarChar(sql.MAX), contenido)
      .query(`
        INSERT INTO transparencia_contenido
          (transparencia_id, contenido)
        OUTPUT INSERTED.*
        VALUES (@transparenciaId, @contenido)
      `);

    return result.recordset[0];
  }

  // Actualizar contenido
  async updateContenido(id, contenido) {
    const pool = await getConnection();

    const result = await pool.request()
      .input("id", sql.Int, id)
      .input("contenido", sql.NVarChar(sql.MAX), contenido)
      .query(`
        UPDATE transparencia_contenido
        SET
          contenido = @contenido,
          fecha_modificacion = SYSDATETIME()
        OUTPUT INSERTED.*
        WHERE id = @id
      `);

    if (result.recordset.length === 0) {
      throw new Error(`No existe contenido con id ${id}`);
    }

    return result.recordset[0];
  }

  // Eliminar contenido
  async deleteContenido(id) {
    const pool = await getConnection();

    const result = await pool.request()
      .input("id", sql.Int, id)
      .query(`
        DELETE FROM transparencia_contenido
        WHERE id = @id
      `);

    if (result.rowsAffected[0] === 0) {
      throw new Error(`No existe contenido con id ${id}`);
    }

    return { mensaje: "Contenido eliminado correctamente" };
  }

  // Obtener archivos por sección
  async getArchivosBySeccion(transparenciaId) {
    const pool = await getConnection();

    const result = await pool.request()
      .input("id", sql.Int, transparenciaId)
      .query(`
        SELECT *
        FROM transparencia_archivos
        WHERE transparencia_id = @id
        ORDER BY fecha_publicacion DESC
      `);

    return result.recordset;
  }

  // Crear archivo
  async createArchivo(transparenciaId, nombreArchivo, urlArchivo) {
    const pool = await getConnection();

    const result = await pool
      .request()
      .input("transparenciaId", sql.Int, transparenciaId)
      .input("nombreArchivo", sql.NVarChar(510), nombreArchivo)
      .input("urlArchivo", sql.NVarChar(1000), urlArchivo)
      .query(`
        INSERT INTO transparencia_archivos (
          transparencia_id,
          nombre_archivo,
          url_archivo
        )
        OUTPUT INSERTED.*
        VALUES (
          @transparenciaId,
          @nombreArchivo,
          @urlArchivo
        )
      `);

    return result.recordset[0];
  }

  // Eliminar archivo
  async deleteArchivo(id) {
    const pool = await getConnection();

    const result = await pool.request()
      .input("id", sql.Int, id)
      .query(`
        DELETE FROM transparencia_archivos
        WHERE id = @id
      `);

    if (result.rowsAffected[0] === 0) {
      throw new Error(`No existe archivo con id ${id}`);
    }

    return { mensaje: "Archivo eliminado correctamente" };
  }

  // Obtener estructura pública completa (con contenido y archivos)
  async getEstructuraPublica() {
    const pool = await getConnection();

    // 1. Traer todas las secciones activas
    const seccionesResult = await pool.request().query(`
      SELECT *
      FROM transparencia
      WHERE activo = 1
      ORDER BY parent_id, orden
    `);

    const secciones = seccionesResult.recordset;

    // 2. Traer todo el contenido
    const contenidoResult = await pool.request().query(`
      SELECT *
      FROM transparencia_contenido
    `);

    const contenidos = contenidoResult.recordset;

    // 3. Traer todos los archivos
    const archivosResult = await pool.request().query(`
      SELECT *
      FROM transparencia_archivos
      ORDER BY fecha_publicacion DESC
    `);

    const archivos = archivosResult.recordset;

    // 4. Mapear secciones por id
    const map = {};

    secciones.forEach((s) => {
      map[s.id] = {
        ...s,
        contenido: contenidos.find(c => c.transparencia_id === s.id) || null,
        archivos: archivos.filter(a => a.transparencia_id === s.id),
        hijos: []
      };
    });

    // 5. Construir árbol
    const tree = [];

    Object.values(map).forEach((s) => {
      if (s.parent_id) {
        map[s.parent_id]?.hijos.push(s);
      } else {
        tree.push(s);
      }
    });

    return tree;
  }
}

const Transparencia = new TransparenciaService();
export default Transparencia;
