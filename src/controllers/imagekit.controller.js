import imagekit from "../config/imagekit.js";

const getAuthParams = (req, res) => {
  try {
    const authParams = imagekit.getAuthenticationParameters();
    res.json(authParams);
  } catch (error) {
    console.error("IMAGEKIT AUTH ERROR:", error);
    res.status(500).json({
      error: "Error generando autenticación de ImageKit",
    });
  }
};

export default { getAuthParams };
