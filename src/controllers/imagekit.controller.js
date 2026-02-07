import imagekit from "../config/imagekit.js";

const getAuthParams = (req, res) => {
  const authParams = imagekit.getAuthenticationParameters();
  res.json(authParams);
};

export default { getAuthParams };
