import DashboardService from "../services/dashboard.service.js";
export const getDashboardSummary = async (req, res) => {
  try {
    const summary = await DashboardService.getSummary();
    res.json(summary);
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ message: "Error al obtener el dashboard" });
  }
};
