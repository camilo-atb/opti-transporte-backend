// Importaciones
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import bodyParser from "body-parser";
import helmet from "helmet";
import cors from "cors";

import rutas from "./routes/routes.js";
import errorHandler from "./middleware/errorHandler.js";
import { closeConnection } from "./config/db.js";

const app = express();
app.disable("x-powered-by");

const PORT = process.env.PORT;

if (!PORT) {
  console.error("❌ PORT no definido. Azure no inyectó el puerto.");
}

app.listen(PORT, () => {
  console.log("🚀 Server running on port", PORT);
});

app.use((req, res, next) => {
  console.log("➡️", req.method, req.url);
  next();
});

// Middlewares globales
app.use(cors());
app.use(helmet());
app.use(bodyParser.json());

// Ruta raíz (health check)
app.get("/", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "Opti Transporte API",
    environment: process.env.NODE_ENV || "development",
  });
});

// Rutas
rutas(app);

// Middleware de errores
app.use(errorHandler);

// Shutdown
process.on("SIGTERM", async () => {
  console.log("🛑 SIGTERM recibido. Cerrando conexiones...");
  await closeConnection();
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
