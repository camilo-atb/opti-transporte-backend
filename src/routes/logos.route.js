import express from "express";
import logosController from "../controllers/logos.controller.js";
import authorize from "../middleware/authorize.js";
import authenticate from "../middleware/authenticate.js";

const Router = express.Router();

Router.get("/", logosController.getLogos);
Router.get("/:id", logosController.getLogoById);
Router.post("/", authenticate,  logosController.crearLogoBySuper);
Router.patch("/:id", authenticate,  logosController.updateLogoBySuper);
Router.delete(
  "/:id",
  authenticate,
  
  logosController.deleteLogoBySuper
);
Router.patch(
  "/:id/activate",
  authenticate,
  
  logosController.activarLogoBySuper
);

export default Router;
