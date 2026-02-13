// services/dashboard.service.js
import { getConnection } from "../config/db.js";

class DashboardService {
  async getSummary() {
    const pool = await getConnection();

    /* ================= USUARIOS EMPLEADOS ================= */
    const usuarios = await pool.request().query(`
      SELECT
        COUNT(*) AS total,
        SUM(CASE WHEN estado = 'activo' THEN 1 ELSE 0 END) AS activos,
        SUM(CASE WHEN estado = 'inactivo' THEN 1 ELSE 0 END) AS inactivos
      FROM usuarios_empleados
    `);

    /* ================= PASAJEROS ================= */
    const pasajeros = await pool.request().query(`
      SELECT COUNT(*) AS total
      FROM usuarios_pasajeros
    `);

    /* ================= NOTICIAS ================= */
    const noticias = await pool.request().query(`
      SELECT COUNT(*) AS total
      FROM noticias
    `);

    /* ================= DESTINOS ================= */
    const destinos = await pool.request().query(`
      SELECT
        COUNT(*) AS total,
        SUM(CASE WHEN activo = 1 THEN 1 ELSE 0 END) AS activos
      FROM destinos_card
    `);

    /* ================= FAQ ================= */
    const faqs = await pool.request().query(`
      SELECT COUNT(*) AS total
      FROM preguntas_frecuentes
    `);

    /* ================= LOGOS ================= */
    const logos = await pool.request().query(`
      SELECT
        COUNT(*) AS total,
        SUM(CASE WHEN activo = 1 THEN 1 ELSE 0 END) AS activos
      FROM logos
    `);

    /* ================= OPINIONES ================= */
    const opiniones = await pool.request().query(`
      SELECT
        COUNT(*) AS total,
        SUM(CASE WHEN aprobado = 1 THEN 1 ELSE 0 END) AS aprobadas,
        SUM(CASE WHEN aprobado = 0 THEN 1 ELSE 0 END) AS pendientes
      FROM opiniones
    `);

    /* ================= TRANSPARENCIA ================= */
    const transparencia = await pool.request().query(`
      SELECT
        (SELECT COUNT(*) FROM transparencia) AS secciones,
        (SELECT COUNT(*) FROM transparencia_archivos) AS archivos
    `);

    return {
      usuarios: usuarios.recordset[0],
      pasajeros: pasajeros.recordset[0].total,
      noticias: noticias.recordset[0].total,
      destinos: destinos.recordset[0],
      faqs: faqs.recordset[0].total,
      logos: logos.recordset[0],
      opiniones: opiniones.recordset[0],
      transparencia: transparencia.recordset[0],
    };
  }
}

export default new DashboardService();
