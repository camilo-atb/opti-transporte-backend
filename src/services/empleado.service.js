import { getConnection } from "../config/db.js";
import sql from "mssql";

class UserService {
  constructor() {
    this.tabla = "usuarios_empleados";
  }

  // Crear usuario
  async crearUser(id_auth_supabase, nombre, apellido, telefono, rol, ruta_imagen = null) {
    const pool = await getConnection();

    const result = await pool.request()
      .input("id_auth_supabase", sql.NVarChar, id_auth_supabase)
      .input("nombre", sql.NVarChar, nombre)
      .input("apellido", sql.NVarChar, apellido)
      .input("telefono", sql.NVarChar, telefono)
      .input("rol", sql.NVarChar, rol)
      .input("ruta_imagen", sql.NVarChar, ruta_imagen)
      .query(`
        INSERT INTO ${this.tabla}
          (id_auth_supabase, nombre, apellido, telefono, rol, ruta_imagen)
        OUTPUT INSERTED.*
        VALUES
          (@id_auth_supabase, @nombre, @apellido, @telefono, @rol, @ruta_imagen)
      `);

    return result.recordset[0];
  }

  // Mostrar usuario completo por ID de Supabase
  async mostrarUserPorIdSupabase(idAuthSupabase) {
    const pool = await getConnection();

    const result = await pool.request()
      .input("id_auth_supabase", sql.NVarChar, idAuthSupabase)
      .query(`
        SELECT * FROM ${this.tabla}
        WHERE id_auth_supabase = @id_auth_supabase
      `);

    return result.recordset[0];
  }

  // Mostrar usuario por ID interno
  async mostrarUserPorId(id) {
    const pool = await getConnection();

    const result = await pool.request()
      .input("id", sql.Int, id)
      .query(`
        SELECT * FROM ${this.tabla}
        WHERE id = @id
      `);

    return result.recordset[0];
  }

  // Mostrar rol
  async mostrarRolPorId(idAuthSupabase) {
    const pool = await getConnection();

    const result = await pool.request()
      .input("id_auth_supabase", sql.NVarChar, idAuthSupabase)
      .query(`
        SELECT rol FROM ${this.tabla}
        WHERE id_auth_supabase = @id_auth_supabase
      `);

    return result.recordset[0]?.rol;
  }

  // Actualizar usuario
  async actualizarUser(idAuthSupabase, campos) {
    const { nombre, apellido, telefono, ruta_imagen } = campos;
    const pool = await getConnection();

    const result = await pool.request()
      .input("id_auth_supabase", sql.NVarChar, idAuthSupabase)
      .input("nombre", sql.NVarChar, nombre ?? null)
      .input("apellido", sql.NVarChar, apellido ?? null)
      .input("telefono", sql.NVarChar, telefono ?? null)
      .input("ruta_imagen", sql.NVarChar, ruta_imagen ?? null)
      .query(`
        UPDATE ${this.tabla}
        SET
          nombre = COALESCE(@nombre, nombre),
          apellido = COALESCE(@apellido, apellido),
          telefono = COALESCE(@telefono, telefono),
          ruta_imagen = COALESCE(@ruta_imagen, ruta_imagen),
          fecha_modificacion = SYSDATETIME()
        OUTPUT INSERTED.*
        WHERE id_auth_supabase = @id_auth_supabase
      `);

    return result.recordset[0];
  }

  // Eliminar usuario
  async eliminarUser(idAuthSupabase) {
    const pool = await getConnection();

    const result = await pool.request()
      .input("id_auth_supabase", sql.NVarChar, idAuthSupabase)
      .query(`
        DELETE FROM ${this.tabla}
        OUTPUT DELETED.*
        WHERE id_auth_supabase = @id_auth_supabase
      `);

    return result.recordset[0];
  }

  // Listar todos los usuarios
  async listarUsers() {
    const pool = await getConnection();

    const result = await pool.request().query(`
      SELECT * FROM ${this.tabla}
      ORDER BY id ASC
    `);

    return result.recordset;
  }
}

export default new UserService();
