import { getConnection } from "../config/db.js";
import sql from "mssql";

class TiquetesService {
  async obtenerSillasOcupadas(viajeId) {
    const pool = await getConnection();

    const result = await pool
      .request()
      .input("viaje_id", sql.Int, viajeId)
      .query(`
        SELECT numero_silla
        FROM tiquetes
        WHERE viaje_id = @viaje_id
          AND estado = 'activo'
      `);

    return result.recordset.map(r => r.numero_silla);
  }
}

export default TiquetesService;