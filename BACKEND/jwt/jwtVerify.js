import jwt from "jsonwebtoken";

export const verifyToken = (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
//   console.log("Decoded Token ➡️:", decoded);
  return decoded;
};

export const verifyRefreshToken = (token) => {
  const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);
  return decoded;
};