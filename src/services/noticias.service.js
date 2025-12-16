import pool from "../config/db.js";

class NoticiasService {
  constructor() {
    this.tabla = "noticias";
  }

  // Crear noticia
  async crearNoticia(titulo, resumen, contenidoCompleto, urlImage, autor, categoria) {
    const categoriaResult = await pool.query(`SELECT id FROM categorias WHERE categoria = $1`, [
      categoria,
    ]);

    if (!categoriaResult.rowCount) {
      throw new Error(`La categoría "${categoria}" no existe.`);
    }

    const categoriaId = categoriaResult.rows[0].id;

    const { rows } = await pool.query(
      `INSERT INTO ${this.tabla} 
            (titulo, resumen, contenido_principal, ruta_imagen, autor, categoria)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *`,
      [titulo, resumen, contenidoCompleto, urlImage, autor, categoriaId]
    );

    return rows[0];
  }

  // Eliminar noticia
  async eliminarNoticia(idNoticia) {
    const { rowCount } = await pool.query(`DELETE FROM ${this.tabla} WHERE id = $1`, [idNoticia]);

    if (rowCount === 0) {
      throw new Error(`No se encontró ninguna noticia con id ${idNoticia}`);
    }

    return { mensaje: "Noticia eliminada correctamente" };
  }

  // Editar noticia
  async editarNoticia(idNoticia, datos) {
    // Buscar noticia actual
    const noticiaActual = await pool.query(`SELECT * FROM ${this.tabla} WHERE id = $1`, [
      idNoticia,
    ]);

    if (noticiaActual.rowCount === 0) {
      throw new Error(`No existe la noticia con id ${idNoticia}`);
    }

    const actual = noticiaActual.rows[0];

    // Combinar datos con valores actuales
    const {
      titulo = actual.titulo,
      resumen = actual.resumen,
      contenido_principal = actual.contenido_principal,
      ruta_imagen = actual.ruta_imagen,
      autor = actual.autor,
      categoria = actual.categoria,
    } = datos;

    // Obtener ID de categoría
    const categoriaIdQuery = await pool.query("SELECT id FROM categorias WHERE categoria = $1", [
      categoria,
    ]);

    const categoriaId = categoriaIdQuery.rowCount > 0 ? categoriaIdQuery.rows[0].id : categoria; // Si ya es ID numérico

    // Actualizar noticia
    const { rows } = await pool.query(
      `UPDATE ${this.tabla}
            SET titulo = $1, resumen = $2, contenido_principal = $3, ruta_imagen = $4, autor = $5, categoria = $6
            WHERE id = $7
            RETURNING *`,
      [titulo, resumen, contenido_principal, ruta_imagen, autor, categoriaId, idNoticia]
    );

    return rows[0];
  }

  // Mostrar solo cards
  async mostrarNoticiasCards() {
    const { rows } = await pool.query(
      `SELECT n.id, n.titulo, n.resumen, n.ruta_imagen, n.autor, c.categoria
            FROM ${this.tabla} n
            INNER JOIN categorias c ON n.categoria = c.id
            ORDER BY n.fecha_publicacion DESC`
    );
    return rows;
  }

  // Mostrar noticia completa
  async mostrarNoticiaPorId(id) {
    const { rows } = await pool.query(
      `SELECT n.id, n.titulo, n.resumen, n.contenido_principal, n.ruta_imagen,
                    n.autor, c.categoria, n.fecha_publicacion
            FROM ${this.tabla} n
            INNER JOIN categorias c ON n.categoria = c.id
            WHERE n.id = $1`,
      [id]
    );

    if (!rows.length) {
      throw new Error("No se encontró la noticia.");
    }

    return rows[0];
  }
}

const noticiasService = new NoticiasService();
export default noticiasService;
