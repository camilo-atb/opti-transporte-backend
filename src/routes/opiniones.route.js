import { Router } from "express";
import {getOpiniones,createOpinion} from "../controllers/opiniones.controller.js";
import authenticatePasajero from "../middleware/authenticatePasajeros.js"

const router = Router();

router.get("/", getOpiniones);


router.post("/", authenticatePasajero, createOpinion);

export default router;
