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

// 🔑 PUERTO CORRECTO
const PORT = process.env.PORT || 3000;

// Log de arranque (CLAVE para Azure)
console.log("🚀 Iniciando backend...");
console.log("🌍 NODE_ENV:", process.env.NODE_ENV);
console.log("🔌 Puerto:", PORT);

// Middlewares globales
app.use(cors());
app.use(helmet());
app.use(bodyParser.json());

// Logger simple
app.use((req, res, next) => {
  console.log("➡️", req.method, req.url);
  next();
});

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

// Shutdown limpio
process.on("SIGTERM", async () => {
  console.log("🛑 SIGTERM recibido. Cerrando conexiones...");
  await closeConnection();
  process.exit(0);
});

// 🚨 UN SOLO listen, SIEMPRE AL FINAL
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});