// Importaciones
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import bodyParser from "body-parser";
import helmet from "helmet";
import cors from "cors";

import rutas from "./routes/routes.js";

import errorHandler from "./middleware/errorHandler.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globales
app.use(cors());
app.use(helmet());
app.use(bodyParser.json());

// Rutas
rutas(app);

// Middleware de errores
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

