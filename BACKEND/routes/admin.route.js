import { Router } from "express";
import { createAdminController, loginAdminController, seeAllUsersController , deleteUserController, logoutAdminController} from "../controllers/admin.controller.js";
import {adminMiddleware , adminCreationGuard} from "../middlewares/admin.middleware.js";
import authMiddleware, { refreshAccessToken } from "../middlewares/auth.middleware.js";
import { COOKIE_NAMES } from "../conf/cookieNames.conf.js";
const router = Router();


// Admin routes
// Admin registration route  (podstman only no publc expose)
router.post("/create_admin" , adminCreationGuard,createAdminController);
// Admin login route
router.post("/login_admin" , loginAdminController);
// Admin-only route to see all users
router.get("/seeAllUsers" , authMiddleware ,adminMiddleware, seeAllUsersController);
// Admin-only route to delete a user by ID
router.delete("/delete_user/:id" , authMiddleware ,adminMiddleware, deleteUserController);

// Admin logout route
router.post("/logout_admin" , authMiddleware, logoutAdminController);

// Admin refresh token route
router.post("/refresh_token" , refreshAccessToken, (req, res) => {
  res.cookie(COOKIE_NAMES.ADMIN_ACCESS_TOKEN, req.newAccessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 1000, // 1 hour
    path: "/",
  });
  return res.status(200).json({
    success: true,
    message: "Token refreshed successfully",
    newAccessToken: req.newAccessToken,
    role: req.user.role,
  });
});

export default router;