import { getConnection } from "../config/db.js";
import sql from "mssql";

class ViajesService {

  async listarViajes() {
    const pool = await getConnection();
    
    const result = await pool.request().query(`
      SELECT 
        id,
        origen,
        destino,
        fecha_salida,
        -- duracion_minutos,
        total_sillas,
        precio,
        placa_bus,
        empresa
      FROM viajes
      WHERE fecha_salida >= GETDATE()
      ORDER BY fecha_salida ASC
    `);
    
    return result.recordset.map(v => {
      const fechaSalida = new Date(v.fecha_salida);

      /*
      const fechaLlegada = new Date(
        fechaSalida.getTime() + v.duracion_minutos * 60000
      );
    
      // ✅ Calcular horas y minutos a partir de duracion_minutos
      const horas = Math.floor(v.duracion_minutos / 60);
      const minutos = v.duracion_minutos % 60;
    */
      return {
        ...v,
        hora_salida: fechaSalida.toLocaleTimeString("es-CO", {
          hour: "2-digit",
          minute: "2-digit"
        }),

        /*
        hora_llegada: fechaLlegada.toLocaleTimeString("es-CO", {
          hour: "2-digit",
          minute: "2-digit"
        }),
        duracion_formateada: `${horas}h ${minutos}m`*/
      };
    });
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
      //.input("duracion_minutos", sql.Int, data.duracion_minutos)
      .input("total_sillas", sql.Int, data.total_sillas)
      .input("precio", sql.Decimal(10,2), data.precio)
      .input("placa_bus", sql.NVarChar, data.placa_bus)
      .input("empresa", sql.NVarChar, data.empresa)
      .input("creado_por", sql.Int, data.creado_por)
      .query(`
        INSERT INTO viajes (
          origen, destino, fecha_salida, -- duracion_minutos,
          total_sillas, precio,
          placa_bus, empresa, creado_por
        )
        OUTPUT INSERTED.*
        VALUES (
          @origen, @destino, @fecha_salida, -- @duracion_minutos,
          @total_sillas, @precio,
          @placa_bus, @empresa, @creado_por
        )
      `);

    return result.recordset[0];
  }
}

export default ViajesService;
