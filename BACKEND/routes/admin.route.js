import { Router } from "express";
import { createAdminController, loginAdminController, seeAllUsersController, deleteUserController, logoutAdminController } from "../controllers/admin.controller.js";
import { adminMiddleware, adminCreationGuard } from "../middlewares/admin.middleware.js";
import authMiddleware, { refreshAccessToken } from "../middlewares/auth.middleware.js";
import { COOKIE_NAMES } from "../conf/cookieNames.conf.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin management routes
 */

/**
 * @swagger
 * /api/v1/admin_route/create_admin:
 *   post:
 *     summary: Create a new admin
 *     description: Protected by secret header. Use x-admin-secret header to access.
 *     tags: [Admin]
 *     parameters:
 *       - in: header
 *         name: admin_creation_secret
 *         required: true
 *         schema:
 *           type: string
 *         description: Admin creation secret key
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Super Admin
 *               email:
 *                 type: string
 *                 example: admin@gmail.com
 *               password:
 *                 type: string
 *                 example: admin123
 *     responses:
 *       201:
 *         description: Admin created successfully
 *       400:
 *         description: Bad request or admin already exists
 *       403:
 *         description: Forbidden - invalid secret
 */
router.post("/create_admin", adminCreationGuard, createAdminController);

/**
 * @swagger
 * /api/v1/admin_route/login_admin:
 *   post:
 *     summary: Admin login
 *     description: Returns JWT token as httpOnly cookie
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@gmail.com
 *               password:
 *                 type: string
 *                 example: admin123
 *     responses:
 *       200:
 *         description: Admin logged in successfully
 *       401:
 *         description: Invalid credentials
 */
router.post("/login_admin", loginAdminController);

/**
 * @swagger
 * /api/v1/admin_route/seeAllUsers:
 *   get:
 *     summary: Get all registered users
 *     description: Admin only route. Requires valid JWT cookie and admin role.
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: All users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       email:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *       401:
 *         description: Unauthorized - no token
 *       403:
 *         description: Forbidden - not an admin
 */
router.get("/seeAllUsers", authMiddleware, adminMiddleware, seeAllUsersController);

/**
 * @swagger
 * /api/v1/admin_route/delete_user/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     description: Admin only route. Permanently deletes a user.
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB user ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - not an admin
 *       404:
 *         description: User not found
 */
router.delete("/delete_user/:id", authMiddleware, adminMiddleware, deleteUserController);

/**
 * @swagger
 * /api/v1/admin_route/logout_admin:
 *   post:
 *     summary: Admin logout
 *     description: Clears the admin JWT cookie
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Admin logged out successfully
 *       401:
 *         description: Unauthorized
 */
router.post("/logout_admin", authMiddleware, logoutAdminController);

/**
 * @swagger
 * /api/v1/admin_route/refresh_token:
 *   post:
 *     summary: Refresh admin access token
 *     description: Uses refresh token to generate a new access token
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 role:
 *                   type: string
 *                   example: admin
 *       401:
 *         description: Invalid or expired refresh token
 */
router.post("/refresh_token", refreshAccessToken, (req, res) => {
  res.cookie(COOKIE_NAMES.ADMIN_ACCESS_TOKEN, req.newAccessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 1000,
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