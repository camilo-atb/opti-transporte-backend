import pool from "../config/db.js";

class PasajerosService {
  constructor() {
    this.tabla = "usuarios_pasajeros";
  }

  // Crear pasajero
  async crearPasajero(id_auth_supabase, nombre, apellido, telefono) {
    const rol = "pasajero"; // constante fija
    const { rows } = await pool.query(
      `INSERT INTO ${this.tabla} (id_auth_supabase, nombre, apellido, telefono, rol)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *`,
      [id_auth_supabase, nombre, apellido, telefono, rol]
    );
    return rows[0];
  }

  // Mostrar pasajero por ID de Supabase
  async mostrarPasajeroPorIdSupabase(idAuthSupabase) {
    const { rows } = await pool.query(`SELECT * FROM ${this.tabla} WHERE id_auth_supabase = $1`, [
      idAuthSupabase,
    ]);
    return rows[0];
  }

  // Mostrar todos los pasajeros
  async listarPasajeros() {
    const { rows } = await pool.query(`SELECT * FROM ${this.tabla}`);
    return rows;
  }

  // Actualizar datos del pasajero
  async actualizarPasajero(idAuthSupabase, { nombre, apellido, telefono }) {
    const { rows } = await pool.query(
      `UPDATE ${this.tabla}
        SET nombre = COALESCE($1, nombre),
            apellido = COALESCE($2, apellido),
            telefono = COALESCE($3, telefono),
            fecha_modificacion = NOW()
        WHERE id_auth_supabase = $4
        RETURNING *`,
      [nombre, apellido, telefono, idAuthSupabase]
    );
    return rows[0];
  }

  // Eliminar pasajero
  async eliminarPasajero(idAuthSupabase) {
    await pool.query(`DELETE FROM ${this.tabla} WHERE id_auth_supabase = $1`, [idAuthSupabase]);
    return true;
  }

  // Obtener solo el rol
  async mostrarRolPorId(idAuthSupabase) {
    const { rows } = await pool.query(`SELECT rol FROM ${this.tabla} WHERE id_auth_supabase = $1`, [
      idAuthSupabase,
    ]);
    return rows[0]?.rol;
  }
}

export default new PasajerosService();
