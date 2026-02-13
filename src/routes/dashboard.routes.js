// dashboard.routes.js
import { Router } from "express";
import { getDashboardSummary } from "../controllers/dashboard.controller.js";

const router = Router();

// SOLO summary, no dashboard
router.get("/summary", getDashboardSummary);

export default router;
