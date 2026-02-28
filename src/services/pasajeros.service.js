import { getConnection } from "../config/db.js";
import sql from "mssql";

class PasajerosService {
  constructor() {
    this.tabla = "usuarios_pasajeros";
  }

  async crearPasajero(id_auth_supabase, nombre, apellido, telefono, cedula) {
    const pool = await getConnection();

    const result = await pool
      .request()
      .input("idAuth", sql.NVarChar, id_auth_supabase)
      .input("nombre", sql.NVarChar, nombre)
      .input("apellido", sql.NVarChar, apellido)
      .input("telefono", sql.NVarChar, telefono)
      .input("cedula", sql.NVarChar, cedula).query(`
        INSERT INTO ${this.tabla}
          (id_auth_supabase, nombre, apellido, telefono, cedula, rol, estado)
        OUTPUT INSERTED.*
        VALUES (@idAuth, @nombre, @apellido, @telefono, @cedula,'pasajero', 'activo')
      `);

    return result.recordset[0];
  }

  async mostrarPasajeroPorIdSupabase(idAuthSupabase) {
    const pool = await getConnection();

    const result = await pool.request().input("idAuth", sql.NVarChar, idAuthSupabase).query(`
        SELECT * FROM ${this.tabla}
        WHERE id_auth_supabase = @idAuth
      `);

    return result.recordset[0];
  }

  async listarPasajeros() {
    const pool = await getConnection();

    const result = await pool.request().query(`
      SELECT * FROM ${this.tabla}
      ORDER BY id ASC
    `);

    return result.recordset;
  }

  async actualizarPasajero(idAuthSupabase, { nombre, apellido, telefono }) {
    const pool = await getConnection();

    const result = await pool
      .request()
      .input("nombre", sql.NVarChar, nombre ?? null)
      .input("apellido", sql.NVarChar, apellido ?? null)
      .input("telefono", sql.NVarChar, telefono ?? null)
      .input("idAuth", sql.NVarChar, idAuthSupabase).query(`
        UPDATE ${this.tabla}
        SET
          nombre = COALESCE(@nombre, nombre),
          apellido = COALESCE(@apellido, apellido),
          telefono = COALESCE(@telefono, telefono),
          fecha_modificacion = SYSDATETIME()
        OUTPUT INSERTED.*
        WHERE id_auth_supabase = @idAuth
      `);

    return result.recordset[0];
  }

  async cambiarEstado(idAuthSupabase, estado) {
    const pool = await getConnection();

    const result = await pool
      .request()
      .input("id_auth_supabase", sql.NVarChar, idAuthSupabase)
      .input("estado", sql.NVarChar, estado).query(`
        UPDATE ${this.tabla}
        SET estado = @estado,
            fecha_modificacion = SYSDATETIME()
        OUTPUT INSERTED.*
        WHERE id_auth_supabase = @id_auth_supabase
      `);

    return result.recordset[0];
  }

  async mostrarRolPorId(idAuthSupabase) {
    const pool = await getConnection();

    const result = await pool.request().input("idAuth", sql.NVarChar, idAuthSupabase).query(`
        SELECT rol FROM ${this.tabla}
        WHERE id_auth_supabase = @idAuth
      `);

    return result.recordset[0]?.rol;
  }

  async mostrarPasajeroPorCedula(cedula) {
    const pool = await getConnection();

    const result = await pool.request()
      .input("cedula", sql.NVarChar, cedula)
      .query(`
        SELECT * FROM usuarios_pasajeros
        WHERE cedula = @cedula
      `);

    return result.recordset[0];
  }

  async crearPasajeroBasico({ cedula, nombre, apellido, telefono }) {
    const pool = await getConnection();

    const result = await pool.request()
      .input("cedula", sql.NVarChar, cedula)
      .input("nombre", sql.NVarChar, nombre)
      .input("apellido", sql.NVarChar, apellido)
      .input("telefono", sql.NVarChar, telefono)
      .query(`
        INSERT INTO usuarios_pasajeros
          (cedula, nombre, apellido, telefono, rol)
        OUTPUT INSERTED.*
        VALUES (@cedula, @nombre, @apellido, @telefono, 'pasajero')
      `);

    return result.recordset[0];
  }
}

export default new PasajerosService();
