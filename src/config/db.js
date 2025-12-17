import sql from "mssql";
import dotenv from "dotenv";
import dns from "dns";

dotenv.config();

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER, // sql-opti-transporte.database.windows.net
  database: process.env.DB_NAME,
  port: 1433,
  options: {
    encrypt: true,
    trustServerCertificate: false
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

let pool;

export const getConnection = async () => {
  try {
    if (!pool) {
      console.log("DB_USER =>", process.env.DB_USER);
      console.log("DB_SERVER =>", process.env.DB_SERVER);

      pool = await sql.connect(config);
      console.log("✅ Conectado a Azure SQL");
    }
    return pool;
  } catch (error) {
    console.error("❌ Error DB:", error);
    throw error;
  }
};

dns.lookup("google.com", (err, address) => {
  console.log("IP de salida real:", address);
});