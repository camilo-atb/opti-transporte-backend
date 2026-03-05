import { getConnection } from "../config/db.js";

export const getAll = async () => {
  const pool = await getConnection();

  const result = await pool.request().query(`
    SELECT * FROM opiniones
    WHERE activo = 1
    ORDER BY fecha DESC
  `);

  return result.recordset;
};

export const crearOpinion = async ({ nombre, opinion, calificacion, pasajero_id }) => {
  const pool = await getConnection();

  await pool.request()
    .input("pasajero_id", pasajero_id)
    .input("nombre", nombre)
    .input("opinion", opinion)
    .input("calificacion", calificacion)
    .query(`
      INSERT INTO opiniones (pasajero_id, nombre, opinion, calificacion)
      VALUES (@pasajero_id, @nombre, @opinion, @calificacion)
    `);

  return { message: "Opinión creada correctamente" };
};
