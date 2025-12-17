// Importaciones
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import bodyParser from "body-parser";
import helmet from "helmet";
import cors from "cors";

import rutas from "./routes/routes.js";
import errorHandler from "./middleware/errorHandler.js";
import { getConnection } from "./config/db.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globales
app.use(cors());
app.use(helmet());
app.use(bodyParser.json());

// Ruta raíz (health check)
app.get("/", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "Opti Transporte API",
    environment: process.env.NODE_ENV || "development"
  });
});

// probar conexión DB
getConnection();

// Rutas
rutas(app);

// Middleware de errores
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
