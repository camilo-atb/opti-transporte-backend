import express from "express";
import authUsuariosRoutes from "./authUsuarios.route.js"; // empleados, administrativos, superusuario
import authPasajerosRoutes from "./authPasajeros.route.js"; // pasajeros
import empleadosRoute from "./empleados.route.js";
import userRoutes from "./empleados.route.js";
import noticiasRoutes from "./noticias.route.js";
import logosRoutes from "./logos.route.js";
import preguntasRoutes from "./preguntas.route.js";
import transparenciaRoutes from "./transparencia.route.js";
import destinosRoutes from "./destinos.route.js";
import imagekitRoutes from "./imagekit.route.js";
import dashboardRoutes from "./dashboard.routes.js";

const rutas = (app) => {
  const router = express.Router();

  router.use("/auth", authUsuariosRoutes);
  router.use("/auth-pasajeros", authPasajerosRoutes);

  router.use("/users", userRoutes);
  router.use("/noticias", noticiasRoutes);
  router.use("/preguntas", preguntasRoutes);
  router.use("/transparencia", transparenciaRoutes);
  router.use("/logos", logosRoutes);
  router.use("/destinos", destinosRoutes);
  router.use("/empleados", empleadosRoute);
  router.use("/imagekit", imagekitRoutes);
  router.use("/dashboard", dashboardRoutes);

  app.use("/api", router);
};

export default rutas;
