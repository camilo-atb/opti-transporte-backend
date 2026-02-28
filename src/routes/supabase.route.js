import express from "express";
import supabaseEmpleados from "../config/supabase.empleados";

const router = express.Router();

router.get("/credentials", (req, res) => {
  res.json({ supabaseEmpleados });
});

export default router;
