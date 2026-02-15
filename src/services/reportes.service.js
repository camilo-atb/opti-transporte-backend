import { getConnection } from "../config/db.js";
import sql from "mssql";

class ReportesService {

  async resumenGeneral() {
    const pool = await getConnection();

    const result = await pool.request().query(`
      WITH ventas_local AS (
        SELECT
          total,
          estado,
          -- Convertimos a hora Colombia
          fecha_venta AT TIME ZONE 'UTC'
                      AT TIME ZONE 'SA Pacific Standard Time'
          AS fecha_local
        FROM ventas
        WHERE estado = 'completada'
      )

      SELECT
        -- Dinero HOY
        SUM(CASE 
              WHEN CAST(fecha_local AS DATE) =
                  CAST(SYSDATETIMEOFFSET() 
                        AT TIME ZONE 'SA Pacific Standard Time' AS DATE)
              THEN total ELSE 0 
            END) AS ventas_hoy,

        -- Dinero MES ACTUAL
        SUM(CASE 
              WHEN fecha_local >= DATEADD(MONTH,
                    DATEDIFF(MONTH, 0,
                      SYSDATETIMEOFFSET()
                      AT TIME ZONE 'SA Pacific Standard Time'),
                    0)
              THEN total ELSE 0 
            END) AS ventas_mes,

        -- Dinero AÑO ACTUAL
        SUM(CASE 
              WHEN fecha_local >= DATEADD(YEAR,
                    DATEDIFF(YEAR, 0,
                      SYSDATETIMEOFFSET()
                      AT TIME ZONE 'SA Pacific Standard Time'),
                    0)
              THEN total ELSE 0 
            END) AS ventas_año,

        -- Dinero TOTAL
        SUM(total) AS ventas_total,

        -- Transacciones HOY
        COUNT(CASE 
              WHEN CAST(fecha_local AS DATE) =
                  CAST(SYSDATETIMEOFFSET()
                        AT TIME ZONE 'SA Pacific Standard Time' AS DATE)
              THEN 1 
            END) AS transacciones_hoy,

        -- Transacciones MES
        COUNT(CASE 
              WHEN fecha_local >= DATEADD(MONTH,
                    DATEDIFF(MONTH, 0,
                      SYSDATETIMEOFFSET()
                      AT TIME ZONE 'SA Pacific Standard Time'),
                    0)
              THEN 1 
            END) AS transacciones_mes,

        -- Transacciones AÑO
        COUNT(CASE 
              WHEN fecha_local >= DATEADD(YEAR,
                    DATEDIFF(YEAR, 0,
                      SYSDATETIMEOFFSET()
                      AT TIME ZONE 'SA Pacific Standard Time'),
                    0)
              THEN 1 
            END) AS transacciones_año,

        -- Transacciones TOTAL
        COUNT(*) AS transacciones_total

      FROM ventas_local
    `);

    return result.recordset[0];
  }

  async reporteMensual(mes, año) {
    const pool = await getConnection();

    const result = await pool.request()
      .input("mes", sql.Int, mes)
      .input("año", sql.Int, año)
      .query(`
        WITH ventas_local AS (
          SELECT
            total,
            estado,
            fecha_venta AT TIME ZONE 'UTC'
                        AT TIME ZONE 'SA Pacific Standard Time'
            AS fecha_local
          FROM ventas
          WHERE estado = 'completada'
        )

        SELECT
          COUNT(*) AS transacciones,
          ISNULL(SUM(total), 0) AS total_vendido
        FROM ventas_local
        WHERE
          MONTH(fecha_local) = @mes
          AND YEAR(fecha_local) = @año
      `);

    return result.recordset[0];
  }

  async reportePorFechas(desde, hasta) {
    const pool = await getConnection();

    const result = await pool.request()
      .input("desde", sql.Date, desde)
      .input("hasta", sql.Date, hasta)
      .query(`
        SELECT
          v.id,
          v.fecha_venta AT TIME ZONE 'UTC'
                        AT TIME ZONE 'SA Pacific Standard Time' AS fecha_venta_local,
          v.total,
          ISNULL(e.nombre + ' ' + e.apellido, 'Sin operario') AS operario
        FROM ventas v
        LEFT JOIN usuarios_empleados e
          ON e.id = v.operario_id
        WHERE
          CAST(v.fecha_venta AT TIME ZONE 'UTC'
                              AT TIME ZONE 'SA Pacific Standard Time' AS DATE)
          BETWEEN @desde AND @hasta
          AND v.estado = 'completada'
        ORDER BY v.fecha_venta DESC
      `);

    return result.recordset;
  }

  async ventasPorOperario() {
    const pool = await getConnection();

    const result = await pool.request().query(`
      SELECT
        e.id,
        e.nombre + ' ' + e.apellido AS operario,
        COUNT(v.id) AS ventas,
        ISNULL(SUM(v.total), 0) AS total_vendido
      FROM usuarios_empleados e
      LEFT JOIN ventas v
        ON v.operario_id = e.id
        AND v.estado = 'completada'
      GROUP BY e.id, e.nombre, e.apellido
      HAVING COUNT(v.id) > 0
      ORDER BY total_vendido DESC
    `);

    return result.recordset;
  }

  async ventasPorRuta() {
    const pool = await getConnection();

    const result = await pool.request().query(`
      SELECT
        vi.origen,
        vi.destino,
        COUNT(t.id) AS tiquetes_vendidos,
        ISNULL(SUM(t.precio), 0) AS ingresos
      FROM viajes vi
      LEFT JOIN tiquetes t 
        ON t.viaje_id = vi.id
      LEFT JOIN ventas v 
        ON v.id = t.venta_id
        AND v.estado = 'completada'
      GROUP BY vi.origen, vi.destino
      HAVING COUNT(t.id) > 0
      ORDER BY ingresos DESC
    `);

    return result.recordset;
  }

  async ocupacionPorViaje() {
    const pool = await getConnection();

    const result = await pool.request().query(`
      SELECT
        vi.id,
        vi.origen,
        vi.destino,
        vi.total_sillas,

        COUNT(t.id) AS sillas_vendidas,

        CASE 
          WHEN vi.total_sillas > 0 
          THEN (COUNT(t.id) * 100.0 / vi.total_sillas)
          ELSE 0
        END AS porcentaje_ocupacion

      FROM viajes vi
      LEFT JOIN tiquetes t
        ON t.viaje_id = vi.id
      LEFT JOIN ventas v
        ON v.id = t.venta_id
        AND v.estado = 'completada'
      GROUP BY
        vi.id,
        vi.origen,
        vi.destino,
        vi.total_sillas
      ORDER BY porcentaje_ocupacion DESC
    `);

    return result.recordset;
  }

  async topRutas(limit = 5) {
    const pool = await getConnection();

    const result = await pool.request()
      .input("limit", sql.Int, limit)
      .query(`
        SELECT TOP (@limit)
          vi.origen,
          vi.destino,
          COUNT(t.id) AS tiquetes,
          ISNULL(SUM(t.precio), 0) AS ingresos
        FROM viajes vi
        LEFT JOIN tiquetes t 
          ON t.viaje_id = vi.id
        LEFT JOIN ventas v 
          ON v.id = t.venta_id
          AND v.estado = 'completada'
        GROUP BY vi.origen, vi.destino
        HAVING COUNT(t.id) > 0
        ORDER BY ingresos DESC
      `);

    return result.recordset;
  }

  async historicoAnual(año) {
    const pool = await getConnection();

    const result = await pool.request()
      .input("año", sql.Int, año)
      .query(`
        WITH ventas_local AS (
          SELECT
            total,
            estado,
            fecha_venta AT TIME ZONE 'UTC'
                        AT TIME ZONE 'SA Pacific Standard Time'
            AS fecha_local
          FROM ventas
          WHERE estado = 'completada'
        )

        SELECT
          MONTH(fecha_local) AS mes,
          COUNT(*) AS transacciones,
          ISNULL(SUM(total), 0) AS total_vendido
        FROM ventas_local
        WHERE YEAR(fecha_local) = @año
        GROUP BY MONTH(fecha_local)
        ORDER BY mes
      `);

    return result.recordset;
  }

  async ventasPorDia(año, mes) {
    const pool = await getConnection();

    const result = await pool.request()
      .input("año", sql.Int, año)
      .input("mes", sql.Int, mes)
      .query(`
        WITH ventas_local AS (
          SELECT
            total,
            estado,
            fecha_venta AT TIME ZONE 'UTC'
                        AT TIME ZONE 'SA Pacific Standard Time'
            AS fecha_local
          FROM ventas
          WHERE estado = 'completada'
        )

        SELECT
          DAY(fecha_local) AS dia,
          COUNT(*) AS transacciones,
          ISNULL(SUM(total), 0) AS total_vendido
        FROM ventas_local
        WHERE 
          YEAR(fecha_local) = @año
          AND MONTH(fecha_local) = @mes
        GROUP BY DAY(fecha_local)
        ORDER BY dia
      `);

    return result.recordset;
  }

  async resumenPorRango(desde, hasta) {
    const pool = await getConnection();

    const result = await pool.request()
      .input("desde", sql.Date, desde)
      .input("hasta", sql.Date, hasta)
      .query(`
        WITH ventas_local AS (
          SELECT
            total,
            estado,
            fecha_venta AT TIME ZONE 'UTC'
                        AT TIME ZONE 'SA Pacific Standard Time'
            AS fecha_local
          FROM ventas
          WHERE estado = 'completada'
        )

        SELECT
          COUNT(*) AS total_transacciones,
          ISNULL(SUM(total), 0) AS total_vendido,
          ISNULL(AVG(total), 0) AS promedio_venta,
          MIN(total) AS venta_minima,
          MAX(total) AS venta_maxima
        FROM ventas_local
        WHERE 
          CAST(fecha_local AS DATE) BETWEEN @desde AND @hasta
      `);

    return result.recordset[0];
  }

  async comparativaMensual(añoActual) {
    const pool = await getConnection();

    const result = await pool.request()
      .input("añoActual", sql.Int, añoActual)
      .input("añoAnterior", sql.Int, añoActual - 1)
      .query(`
        WITH ventas_local AS (
          SELECT
            total,
            estado,
            fecha_venta AT TIME ZONE 'UTC'
                        AT TIME ZONE 'SA Pacific Standard Time'
            AS fecha_local
          FROM ventas
          WHERE estado = 'completada'
        )

        SELECT
          MONTH(fecha_local) AS mes,
          
          SUM(CASE WHEN YEAR(fecha_local) = @añoActual 
              THEN total ELSE 0 END) AS ventas_año_actual,
          
          SUM(CASE WHEN YEAR(fecha_local) = @añoAnterior 
              THEN total ELSE 0 END) AS ventas_año_anterior,
          
          COUNT(CASE WHEN YEAR(fecha_local) = @añoActual 
                THEN 1 END) AS transacciones_año_actual,
          
          COUNT(CASE WHEN YEAR(fecha_local) = @añoAnterior 
                THEN 1 END) AS transacciones_año_anterior

        FROM ventas_local
        WHERE 
          YEAR(fecha_local) IN (@añoActual, @añoAnterior)
        GROUP BY MONTH(fecha_local)
        ORDER BY mes
      `);

    return result.recordset;
  }

}

export default new ReportesService();