import express from "express";
import logosController from "../controllers/logos.controller.js";
import authorize from "../middleware/authorize.js";
import authenticate from "../middleware/authenticate.js";

const Router = express.Router();

Router.get("/", logosController.getLogos);
Router.get("/:id", logosController.getLogoById);
Router.post("/", authenticate, authorize(["super-usuario"]), logosController.crearLogoBySuper);
Router.patch("/:id", authenticate, authorize(["super-usuario"]), logosController.updateLogoBySuper);
Router.delete(
  "/:id",
  authenticate,
  authorize(["super-usuario"]),
  logosController.deleteLogoBySuper
);
Router.patch(
  "/:id/activate",
  authenticate,
  authorize(["super-usuario"]),
  logosController.activarLogoBySuper
);

export default Router;
