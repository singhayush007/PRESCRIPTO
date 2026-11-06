import jwt from "jsonwebtoken";

// admin authentication middleware
const authAdmin = async (req, res, next) => {
  const { atoken } = req.headers;
  if (!atoken) {
    return res.status(401).json({ success: false, message: "Not Authorized Login Again" });
  }
  try {
    const token_decode = jwt.verify(atoken, process.env.JWT_SECRET);
    if (token_decode.role !== "admin") throw new Error("Not admin");
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Session expired. Login Again" });
  }
};

export default authAdmin;
