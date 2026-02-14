import { getConnection } from "../config/db.js";
import sql from "mssql";

class ViajesService {
  async listarViajes() {
    const pool = await getConnection();
    const result = await pool.request().query(`SELECT * FROM viajes`);
    return result.recordset;
  }

  async obtenerViajePorId(id) {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query(`SELECT * FROM viajes WHERE id = @id`);

    return result.recordset[0];
  }

  async crearViaje(data) {
    const pool = await getConnection();

    const result = await pool.request()
      .input("origen", sql.NVarChar, data.origen)
      .input("destino", sql.NVarChar, data.destino)
      .input("fecha_salida", sql.DateTime2, data.fecha_salida)
      .input("total_sillas", sql.Int, data.total_sillas)
      .input("precio", sql.Decimal(10,2), data.precio)
      .input("placa_bus", sql.NVarChar, data.placa_bus)
      .input("empresa", sql.NVarChar, data.empresa)
      .input("creado_por", sql.Int, data.creado_por)
      .query(`
        INSERT INTO viajes (
          origen, destino, fecha_salida,
          total_sillas, precio,
          placa_bus, empresa, creado_por
        )
        OUTPUT INSERTED.*
        VALUES (
          @origen, @destino, @fecha_salida,
          @total_sillas, @precio,
          @placa_bus, @empresa, @creado_por
        )
      `);

    return result.recordset[0];
  }
}

export default ViajesService;
