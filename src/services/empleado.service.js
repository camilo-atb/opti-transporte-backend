import { getConnection } from "../config/db.js";
import sql from "mssql";

class UserService {
  constructor() {
    this.tabla = "usuarios_empleados";
  }

  // Crear usuario
  async crearUser(id_auth_supabase, nombre, apellido, telefono, rol, ruta_imagen = null) {
    const pool = await getConnection();

    const result = await pool
      .request()
      .input("id_auth_supabase", sql.NVarChar, id_auth_supabase)
      .input("nombre", sql.NVarChar, nombre)
      .input("apellido", sql.NVarChar, apellido)
      .input("telefono", sql.NVarChar, telefono)
      .input("rol", sql.NVarChar, rol)
      .input("ruta_imagen", sql.NVarChar, ruta_imagen).query(`
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

    const result = await pool.request().input("id_auth_supabase", sql.NVarChar, idAuthSupabase)
      .query(`
        SELECT * FROM ${this.tabla}
        WHERE id_auth_supabase = @id_auth_supabase
      `);

    return result.recordset[0];
  }

  // Mostrar usuario por ID interno
  async mostrarUserPorId(id) {
    const pool = await getConnection();

    const result = await pool.request().input("id", sql.Int, id).query(`
        SELECT * FROM ${this.tabla}
        WHERE id = @id
      `);

    return result.recordset[0];
  }

  // Mostrar rol
  async mostrarRolPorId(idAuthSupabase) {
    const pool = await getConnection();

    const result = await pool.request().input("id_auth_supabase", sql.NVarChar, idAuthSupabase)
      .query(`
        SELECT rol FROM ${this.tabla}
        WHERE id_auth_supabase = @id_auth_supabase
      `);

    return result.recordset[0]?.rol;
  }

  // Actualizar usuario
  async actualizarUser(idAuthSupabase, campos) {
    try {
      const pool = await getConnection();
      const request = pool.request();

      request.input("id_auth_supabase", sql.NVarChar, idAuthSupabase);

      request.input("nombre", sql.NVarChar, campos.nombre !== undefined ? campos.nombre : null);
      request.input("apellido", sql.NVarChar, campos.apellido !== undefined ? campos.apellido : null);
      request.input("telefono", sql.NVarChar, campos.telefono !== undefined ? campos.telefono : null);
      request.input("ruta_imagen", sql.NVarChar, campos.ruta_imagen !== undefined ? campos.ruta_imagen : null);

      const query = `
        UPDATE ${this.tabla}
        SET
          nombre = ISNULL(@nombre, nombre),
          apellido = ISNULL(@apellido, apellido),
          telefono = ISNULL(@telefono, telefono),
          ruta_imagen = ISNULL(@ruta_imagen, ruta_imagen),
          fecha_modificacion = SYSDATETIME()
        OUTPUT INSERTED.*
        WHERE id_auth_supabase = @id_auth_supabase
      `;

      const result = await request.query(query);
      return result.recordset[0];
    } catch (error) {
      console.error("Error en SQL Service:", error);
      throw error; // Esto permitirá que el controller lo atrape en el catch(error)
    }
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

  // Eliminar usuario
  /*async eliminarUser(idAuthSupabase) {
    const pool = await getConnection();

    const result = await pool.request()
      .input("id_auth_supabase", sql.NVarChar, idAuthSupabase)
      .query(`
        DELETE FROM ${this.tabla}
        OUTPUT DELETED.*
        WHERE id_auth_supabase = @id_auth_supabase
      `);

    return result.recordset[0];
  }*/

  // Listar todos los usuarios
  /*async listarUsers() {
    const pool = await getConnection();

    const result = await pool.request().query(`
      SELECT * FROM ${this.tabla}
      ORDER BY id ASC
    `);

    return result.recordset;
  }*/

  // Listar usuarios por estado
  async listarUsersPorEstado() {
    const pool = await getConnection();

    const activos = await pool.request().query(`
      SELECT * FROM ${this.tabla}
      WHERE estado = 'activo'
      ORDER BY id ASC
    `);

    const inactivos = await pool.request().query(`
      SELECT * FROM ${this.tabla}
      WHERE estado = 'inactivo'
      ORDER BY id ASC
    `);

    return {
      activos: activos.recordset,
      inactivos: inactivos.recordset,
    };
  }

}

export default new UserService();
