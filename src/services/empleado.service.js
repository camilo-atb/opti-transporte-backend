// services/user.service.js
import pool from "../config/db.js";

class UserService {
  constructor() {
    this.tabla = "usuarios";
  }

  // Crear usuario
  async crearUser(id_auth_supabase, nombre, apellido, telefono, rol, ruta_imagen = null) {
    const { rows } = await pool.query(
      `INSERT INTO ${this.tabla} (id_auth_supabase, nombre, apellido, telefono, rol, ruta_imagen)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *`,
      [id_auth_supabase, nombre, apellido, telefono, rol, ruta_imagen]
    );
    return rows[0];
  }

  // Mostrar usuario completo por ID de Supabase
  async mostrarUserPorIdSupabase(idAuthSupabase) {
    const { rows } = await pool.query(`SELECT * FROM ${this.tabla} WHERE id_auth_supabase = $1`, [
      idAuthSupabase,
    ]);
    return rows[0];
  }

  // Mostrar usuario por ID interno (de tabla)
  async mostrarUserPorId(id) {
    const { rows } = await pool.query(`SELECT * FROM ${this.tabla} WHERE id = $1`, [id]);
    return rows[0];
  }

  // Mostrar rol
  async mostrarRolPorId(idAuthSupabase) {
    const { rows } = await pool.query(`SELECT rol FROM ${this.tabla} WHERE id_auth_supabase = $1`, [
      idAuthSupabase,
    ]);
    return rows[0]?.rol;
  }

  // Actualizar usuario (solo ciertos campos)
  async actualizarUser(idAuthSupabase, campos) {
    const { nombre, apellido, telefono, ruta_imagen } = campos;

    const { rows } = await pool.query(
      `UPDATE ${this.tabla}
        SET nombre = COALESCE($1, nombre),
        apellido = COALESCE($2, apellido),
        telefono = COALESCE($3, telefono),
        ruta_imagen = COALESCE($4, ruta_imagen),
        fecha_modificacion = NOW()
        WHERE id_auth_supabase = $5
        RETURNING *`,
      [nombre, apellido, telefono, ruta_imagen, idAuthSupabase]
    );

    return rows[0];
  }

  // Eliminar usuario
  async eliminarUser(idAuthSupabase) {
    const { rows } = await pool.query(
      `DELETE FROM ${this.tabla} WHERE id_auth_supabase = $1 RETURNING *`,
      [idAuthSupabase]
    );
    return rows[0];
  }

  // Listar todos los usuarios
  async listarUsers() {
    const { rows } = await pool.query(`SELECT * FROM ${this.tabla} ORDER BY id ASC`);
    return rows;
  }
}

export default new UserService();
