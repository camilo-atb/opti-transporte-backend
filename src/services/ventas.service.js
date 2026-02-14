import { getConnection } from "../config/db.js";
import sql from "mssql";

class VentasService {
  constructor() {
    this.tablaVentas = "ventas";
    this.tablaTiquetes = "tiquetes";
  }

  async crearVenta({ operario_id, pasajero_id, viaje_id, sillas, precio_unitario }) {
    const pool = await getConnection();
    const transaction = new sql.Transaction(pool);

    try {
      await transaction.begin();

      const total = sillas.length * precio_unitario;

      const ventaResult = await transaction
        .request()
        .input("operario_id", sql.Int, operario_id)
        .input("pasajero_id", sql.Int, pasajero_id)
        .input("total", sql.Decimal(10, 2), total)
        .query(`
          INSERT INTO ventas (operario_id, pasajero_id, total)
          OUTPUT INSERTED.*
          VALUES (@operario_id, @pasajero_id, @total)
        `);

      const venta = ventaResult.recordset[0];

      for (const numero_silla of sillas) {
        await transaction
          .request()
          .input("venta_id", sql.Int, venta.id)
          .input("viaje_id", sql.Int, viaje_id)
          .input("numero_silla", sql.Int, numero_silla)
          .input("precio", sql.Decimal(10, 2), precio_unitario)
          .query(`
            INSERT INTO tiquetes (venta_id, viaje_id, numero_silla, precio)
            VALUES (@venta_id, @viaje_id, @numero_silla, @precio)
          `);
      }

      await transaction.commit();
      return venta;

    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async historialPorOperario(operarioId) {
    const pool = await getConnection();

    const result = await pool
      .request()
      .input("operario_id", sql.Int, operarioId)
      .query(`
        SELECT v.id, v.fecha_venta, v.total,
               p.nombre, p.apellido
        FROM ventas v
        JOIN usuarios_pasajeros p ON p.id = v.pasajero_id
        WHERE v.operario_id = @operario_id
        ORDER BY v.fecha_venta DESC
      `);

    return result.recordset;
  }

  async resumenOperario(operarioId) {
    const pool = await getConnection();

    const result = await pool
      .request()
      .input("operario_id", sql.Int, operarioId)
      .query(`
        SELECT
          SUM(CASE 
                WHEN CAST(fecha_venta AS DATE) = CAST(GETDATE() AS DATE)
                THEN total ELSE 0 END) AS ventas_hoy,

          SUM(CASE 
                WHEN DATEPART(WEEK, fecha_venta) = DATEPART(WEEK, GETDATE())
                AND YEAR(fecha_venta) = YEAR(GETDATE())
                THEN total ELSE 0 END) AS ventas_semana,

          SUM(CASE 
                WHEN MONTH(fecha_venta) = MONTH(GETDATE())
                AND YEAR(fecha_venta) = YEAR(GETDATE())
                THEN total ELSE 0 END) AS ventas_mes,

          SUM(total) AS ventas_total,

          COUNT(CASE 
                WHEN CAST(fecha_venta AS DATE) = CAST(GETDATE() AS DATE)
                THEN 1 END) AS transacciones_hoy,

          COUNT(*) AS transacciones_total

        FROM ventas
        WHERE operario_id = @operario_id
      `);

    return result.recordset[0];
  }

  async obtenerTicketPorVenta(ventaId) {
    const pool = await getConnection();

    const result = await pool
      .request()
      .input("venta_id", sql.Int, ventaId)
      .query(`
        SELECT
          v.id AS venta_id,
          v.fecha_venta,
          v.total,

          p.cedula,
          p.nombre,
          p.apellido,

          vi.origen,
          vi.destino,
          vi.hora_salida,

          b.placa,

          t.numero_silla

        FROM ventas v

        JOIN usuarios_pasajeros p 
          ON p.id = v.pasajero_id

        JOIN tiquetes t 
          ON t.venta_id = v.id

        JOIN viajes vi 
          ON vi.id = t.viaje_id

        JOIN buses b 
          ON b.id = vi.bus_id

        WHERE v.id = @venta_id
      `);

    if (result.recordset.length === 0) {
      return null;
    }

    const data = result.recordset;

    const ticket = {
      venta_id: data[0].venta_id,
      fecha_venta: data[0].fecha_venta,
      total: data[0].total,

      pasajero: {
        cedula: data[0].cedula,
        nombre: data[0].nombre,
        apellido: data[0].apellido,
      },

      viaje: {
        origen: data[0].origen,
        destino: data[0].destino,
        hora_salida: data[0].hora_salida,
      },

      bus: {
        placa: data[0].placa,
      },

      sillas: data.map((r) => r.numero_silla),
    };

    return ticket;
  }


}

export default VentasService;