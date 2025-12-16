import pg from "pg";
const { Pool } = pg;
const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
});

pool
  .connect()
  .then((client) => {
    console.log("Conexión exitosa a la db");
    client.release();
  })
  .catch((err) => {
    console.error("Error conectando al pool:", err);
  });

export default pool;
