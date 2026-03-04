import express from "express";
import supabase from "../config/supabase";

const router = express.Router();

router.get("/credentials", (req, res) => {
  res.json({ supabase });
});

export default router;
