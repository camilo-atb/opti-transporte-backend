import pool from "../config/db.js";

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

    const query = `
        INSERT INTO ${this.tableOpiniones} (user_id, puntuacion, titulo_opinion, opinion)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
        `;

    const values = [userId, puntuacion, tituloOpinion, opinion];
    const { rows } = await pool.query(query, values);

    return rows[0];
  }

  // Obtener todas las opiniones
  async getOpiniones(aprobadas = true) {
    const query = `
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
        JOIN ${this.tableUsuarios} u ON o.user_id = u.id
        ${aprobadas ? "WHERE o.aprobado = TRUE" : ""}
        ORDER BY o.fecha_publicacion DESC;
        `;
    const { rows } = await pool.query(query);
    return rows;
  }

  // Obtener una sola opinión por ID
  async getOpinionById(id) {
    const query = `
        SELECT 
            o.*,
            u.nombre,
            u.apellido,
            u.ruta_imagen
        FROM ${this.tableOpiniones} o
        JOIN ${this.tableUsuarios} u ON o.user_id = u.id
        WHERE o.id = $1;
        `;
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }

  // Actualizar una opinión (solo autor o admin)
  async updateOpinion(idOpinion, data) {
    const { puntuacion, tituloOpinion, opinion, aprobado } = data;

    const query = `
        UPDATE ${this.tableOpiniones}
        SET 
            puntuacion = COALESCE($1, puntuacion),
            titulo_opinion = COALESCE($2, titulo_opinion),
            opinion = COALESCE($3, opinion),
            aprobado = COALESCE($4, aprobado),
            fecha_modificacion = NOW()
        WHERE id = $5
        RETURNING *;
        `;
    const values = [puntuacion, tituloOpinion, opinion, aprobado, idOpinion];
    const { rows } = await pool.query(query, values);

    if (rows.length === 0) {
      throw new Error("Opinión no encontrada");
    }

    return rows[0];
  }

  // Eliminar una opinión
  async deleteOpinion(idOpinion) {
    const query = `DELETE FROM ${this.tableOpiniones} WHERE id = $1 RETURNING *;`;
    const { rows } = await pool.query(query, [idOpinion]);

    if (rows.length === 0) {
      throw new Error("Opinión no encontrada");
    }

    return { mensaje: "Opinión eliminada correctamente", opinion: rows[0] };
  }
}

export default new OpinionesService();
