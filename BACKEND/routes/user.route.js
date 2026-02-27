// src/routes/user.route.js

import { Router } from "express";

import {
  createUserController,
  loginUserController,
  getMyProfileController,
  updateMyProfileController,
  createTaskController,
  getMyTasksController,
  getSingleTaskController,
  updateTaskController,
  deleteTaskController,
  logoutUserController
} from "../controllers/user.controller.js";

import authMiddleware, { refreshAccessToken } from "../middlewares/auth.middleware.js";
import { COOKIE_NAMES } from "../conf/cookieNames.conf.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: User Auth
 *     description: User registration and login
 *   - name: User Profile
 *     description: Profile management
 *   - name: Tasks
 *     description: Task CRUD operations
 */

/**
 * @swagger
 * /api/v1/user_route/create_user:
 *   post:
 *     summary: Register a new user
 *     tags: [User Auth]
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
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@gmail.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Bad request or user already exists
 */
router.post("/create_user", createUserController);

/**
 * @swagger
 * /api/v1/user_route/login_user:
 *   post:
 *     summary: User login
 *     description: Returns JWT token as httpOnly cookie
 *     tags: [User Auth]
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
 *                 example: john@gmail.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       401:
 *         description: Invalid credentials
 */
router.post("/login_user", loginUserController);

/**
 * @swagger
 * /api/v1/user_route/logout_user:
 *   post:
 *     summary: User logout
 *     description: Clears the user JWT cookie
 *     tags: [User Auth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: User logged out successfully
 *       401:
 *         description: Unauthorized
 */
router.post("/logout_user", authMiddleware, logoutUserController);

/**
 * @swagger
 * /api/v1/user_route/refresh_token:
 *   post:
 *     summary: Refresh user access token
 *     description: Uses refresh token to generate a new access token
 *     tags: [User Auth]
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
 *                   example: user
 *       401:
 *         description: Invalid or expired refresh token
 */
router.post("/refresh_token", refreshAccessToken, (req, res) => {
  res.cookie(COOKIE_NAMES.USER_ACCESS_TOKEN, req.newAccessToken, {
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

/**
 * @swagger
 * /api/v1/user_route/my_profile:
 *   get:
 *     summary: Get logged-in user profile
 *     tags: [User Profile]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *       401:
 *         description: Unauthorized
 */
router.get("/my_profile", authMiddleware, getMyProfileController);

/**
 * @swagger
 * /api/v1/user_route/update_profile:
 *   patch:
 *     summary: Update logged-in user profile
 *     tags: [User Profile]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Updated
 *               email:
 *                 type: string
 *                 example: johnupdated@gmail.com
 *               password:
 *                 type: string
 *                 example: newpassword123
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.patch("/update_profile", authMiddleware, updateMyProfileController);

/**
 * @swagger
 * /api/v1/user_route/create_task:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 example: My first task
 *               description:
 *                 type: string
 *                 example: Task description here
 *               status:
 *                 type: string
 *                 enum: [pending, in-progress, completed]
 *                 example: pending
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *                 example: medium
 *     responses:
 *       201:
 *         description: Task created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post("/create_task", authMiddleware, createTaskController);

/**
 * @swagger
 * /api/v1/user_route/my_tasks:
 *   get:
 *     summary: Get all tasks of logged-in user
 *     tags: [Tasks]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Tasks retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 tasks:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       title:
 *                         type: string
 *                       description:
 *                         type: string
 *                       status:
 *                         type: string
 *                       priority:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *       401:
 *         description: Unauthorized
 */
router.get("/my_tasks", authMiddleware, getMyTasksController);

/**
 * @swagger
 * /api/v1/user_route/task/{id}:
 *   get:
 *     summary: Get a single task by ID
 *     tags: [Tasks]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     responses:
 *       200:
 *         description: Task retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Task not found
 */
router.get("/task/:id", authMiddleware, getSingleTaskController);

/**
 * @swagger
 * /api/v1/user_route/task/{id}:
 *   put:
 *     summary: Update a task by ID
 *     tags: [Tasks]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Updated task title
 *               description:
 *                 type: string
 *                 example: Updated description
 *               status:
 *                 type: string
 *                 enum: [pending, in-progress, completed]
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *     responses:
 *       200:
 *         description: Task updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Task not found
 */
router.put("/task/:id", authMiddleware, updateTaskController);

/**
 * @swagger
 * /api/v1/user_route/task/{id}:
 *   delete:
 *     summary: Delete a task by ID
 *     tags: [Tasks]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Task not found
 */
router.delete("/task/:id", authMiddleware, deleteTaskController);

export default router;