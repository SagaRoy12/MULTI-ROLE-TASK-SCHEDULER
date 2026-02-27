import jwt from "jsonwebtoken";
import User from "../models/user-admin.model.js";
import { COOKIE_NAMES } from "../conf/cookieNames.conf.js";
import { verifyRefreshToken } from "../jwt/jwtVerify.js";
import { signedJsonWebToken } from "../jwt/jwtSign.js";

const getTokenFromCookies = (cookies) => {
  return cookies?.[COOKIE_NAMES.ADMIN_ACCESS_TOKEN] || cookies?.[COOKIE_NAMES.USER_ACCESS_TOKEN];
};

export const refreshAccessToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.[COOKIE_NAMES.ADMIN_REFRESH_TOKEN] || req.cookies?.[COOKIE_NAMES.USER_REFRESH_TOKEN];
    
    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token not found",
      });
    }

    const decoded = verifyRefreshToken(refreshToken);
    const user = await User.findById(decoded.id).select("name email role");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    const newAccessToken = await signedJsonWebToken({
      id: user._id,
      email: user.email,
      role: user.role,
    });

    req.user = user;
    req.newAccessToken = newAccessToken;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired refresh token",
    });
  }
};

const authMiddleware = async (req, res, next) => {
  try {
    const token = getTokenFromCookies(req.cookies);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. No token provided.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("name email role");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. User not found.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};

export default authMiddleware;