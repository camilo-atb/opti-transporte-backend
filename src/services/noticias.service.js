import { getConnection } from "../config/db.js";
import sql from "mssql";

class NoticiasService {
  constructor() {
    this.tabla = "noticias";
  }

  // Crear noticia
  async crearNoticia(
    titulo,
    resumen,
    contenidoCompleto,
    urlImage,
    imagekitFileId,
    autor,
    categoria
  ) {
    const pool = await getConnection();

    // Obtener ID de categoría
    const categoriaResult = await pool.request().input("categoria", sql.NVarChar, categoria).query(`
        SELECT id
        FROM categorias
        WHERE categoria = @categoria
      `);

    if (categoriaResult.recordset.length === 0) {
      throw new Error(`La categoría "${categoria}" no existe.`);
    }

    const categoriaId = categoriaResult.recordset[0].id;

    const result = await pool
      .request()
      .input("titulo", sql.NVarChar, titulo)
      .input("resumen", sql.NVarChar, resumen)
      .input("contenido", sql.NVarChar, contenidoCompleto)
      .input("ruta_imagen", sql.NVarChar, urlImage)
      .input("imagekit_file_id", sql.NVarChar, imagekitFileId)
      .input("autor", sql.NVarChar, autor)
      .input("categoriaId", sql.Int, categoriaId).query(`
        INSERT INTO ${this.tabla}
          (titulo, resumen, contenido_principal, ruta_imagen, imagekit_file_id, autor, categoria)
        OUTPUT INSERTED.*
        VALUES (@titulo, @resumen, @contenido, @ruta_imagen, @imagekit_file_id, @autor, @categoriaId)
      `);

    return result.recordset[0];
  }

  // Eliminar noticia
  async eliminarNoticia(idNoticia) {
    const pool = await getConnection();

    const noticiaResult = await pool.request().input("id", sql.Int, idNoticia).query(`
        SELECT imagekit_file_id
        FROM ${this.tabla}
        WHERE id = @id
      `);

    if (noticiaResult.recordset.length === 0) {
      throw new Error(`No se encontró ninguna noticia con id ${idNoticia}`);
    }

    const { imagekit_file_id } = noticiaResult.recordset[0];

    if (imagekit_file_id) {
      try {
        await imagekit.deleteFile(imagekit_file_id);
      } catch (err) {
        console.error("Error eliminando imagen en ImageKit:", err.message);
      }
    }

    await pool.request().input("id", sql.Int, idNoticia).query(`
        DELETE FROM ${this.tabla}
        WHERE id = @id
      `);

    return { mensaje: "Noticia eliminada correctamente" };
  }

  // Editar noticia
  async editarNoticia(idNoticia, datos) {
    const pool = await getConnection();

    const noticiaActual = await pool
      .request()
      .input("id", sql.Int, idNoticia)
      .query(`SELECT * FROM ${this.tabla} WHERE id = @id`);

    if (noticiaActual.recordset.length === 0) {
      throw new Error(`No existe la noticia con id ${idNoticia}`);
    }

    const actual = noticiaActual.recordset[0];

    const titulo = datos.titulo?.trim() || actual.titulo;

    const resumen = datos.resumen?.trim() || actual.resumen;

    const contenido_principal = datos.contenido_principal?.trim() || actual.contenido_principal;

    const ruta_imagen = datos.ruta_imagen?.trim() || actual.ruta_imagen;

    const autor = datos.autor?.trim() || actual.autor;

    let categoria = datos.categoria ?? actual.categoria;

    let categoriaId = categoria;

    if (typeof categoria === "string") {
      const categoriaResult = await pool
        .request()
        .input("categoria", sql.NVarChar, categoria.trim().toLowerCase()).query(`
        SELECT id
        FROM categorias
        WHERE LOWER(categoria) = @categoria
      `);

      if (categoriaResult.recordset.length === 0) {
        throw new Error(`La categoría "${categoria}" no existe.`);
      }

      categoriaId = categoriaResult.recordset[0].id;
    }

    const result = await pool
      .request()
      .input("titulo", sql.NVarChar, titulo)
      .input("resumen", sql.NVarChar, resumen)
      .input("contenido", sql.NVarChar, contenido_principal)
      .input("ruta_imagen", sql.NVarChar, ruta_imagen)
      .input("autor", sql.NVarChar, autor)
      .input("categoriaId", sql.Int, categoriaId)
      .input("id", sql.Int, idNoticia).query(`
      UPDATE ${this.tabla}
      SET titulo = @titulo,
          resumen = @resumen,
          contenido_principal = @contenido,
          ruta_imagen = @ruta_imagen,
          autor = @autor,
          categoria = @categoriaId
      OUTPUT INSERTED.*
      WHERE id = @id
    `);

    return result.recordset[0];
  }

  // Mostrar noticia completa por ID
  async mostrarNoticiaPorId(id) {
    const pool = await getConnection();

    const result = await pool.request().input("id", sql.Int, id).query(`
        SELECT
          n.id,
          n.titulo,
          n.resumen,
          n.contenido_principal,
          n.ruta_imagen,
          n.autor,
          c.categoria,
          n.fecha_publicacion
        FROM ${this.tabla} n
        INNER JOIN categorias c ON n.categoria = c.id
        WHERE n.id = @id
      `);

    if (result.recordset.length === 0) {
      throw new Error("No se encontró la noticia.");
    }

    return result.recordset[0];
  }

  // Últimas 3 noticias
  async mostrarUltimasNoticias(limit = 3) {
    const pool = await getConnection();

    const result = await pool.request().input("limit", sql.Int, limit).query(`
        SELECT TOP (@limit)
          n.id,
          n.titulo,
          n.resumen,
          n.ruta_imagen,
          n.autor,
          c.categoria,
          n.fecha_publicacion
        FROM ${this.tabla} n
        INNER JOIN categorias c ON n.categoria = c.id
        ORDER BY n.fecha_publicacion DESC
      `);

    return result.recordset;
  }

  // Noticias con paginación
  async mostrarNoticiasPaginadas(page = 1, limit = 10) {
    const pool = await getConnection();
    const offset = (page - 1) * limit;

    const result = await pool
      .request()
      .input("limit", sql.Int, limit)
      .input("offset", sql.Int, offset).query(`
        SELECT
          n.id,
          n.titulo,
          n.resumen,
          n.ruta_imagen,
          n.autor,
          c.categoria,
          n.fecha_publicacion
        FROM ${this.tabla} n
        INNER JOIN categorias c ON n.categoria = c.id
        ORDER BY n.fecha_publicacion DESC
        OFFSET @offset ROWS
        FETCH NEXT @limit ROWS ONLY
      `);

    // total para la paginación
    const totalResult = await pool.request().query(`
      SELECT COUNT(*) AS total FROM ${this.tabla}
    `);

    return {
      data: result.recordset,
      total: totalResult.recordset[0].total,
      page,
      limit,
    };
  }
}

const noticiasService = new NoticiasService();
export default noticiasService;
