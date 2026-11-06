import jwt from "jsonwebtoken";

// doctor authentication middleware
const authDoctor = async (req, res, next) => {
  const { dtoken } = req.headers;
  if (!dtoken) {
    return res
      .status(401)
      .json({ success: false, message: "Not Authorized Login Again" });
  }
  try {
    const token_decode = jwt.verify(dtoken, process.env.JWT_SECRET);
    if (!token_decode.id) throw new Error("Invalid token");
    req.body.docId = token_decode.id;
    next();
  } catch (error) {
    res
      .status(401)
      .json({ success: false, message: "Session expired. Login Again" });
  }
};

export default authDoctor;
