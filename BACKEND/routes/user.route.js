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
  deleteTaskController
} from "../controllers/user.controller.js";

import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();


// alluser authge

// Register user
router.post("/create_user", createUserController);

// Login user
router.post("/login_user", loginUserController);


// user profile routes

// Get logged-in user's profile
router.get("/my_profile", authMiddleware, getMyProfileController);

// Update logged-in user's profile
router.patch("/update_profile", authMiddleware, updateMyProfileController);;


// user task routes

// Create a task
router.post("/create_task", authMiddleware, createTaskController);

// Get all tasks of the logged-in user
router.get("/my_tasks", authMiddleware, getMyTasksController);

// Get a specific task (only if owned by user)
router.get("/task/:id", authMiddleware, getSingleTaskController);

// Update a task (only if owned by user)
router.put("/task/:id", authMiddleware, updateTaskController);

// Delete a task (only if owned by user)
router.delete("/task/:id", authMiddleware, deleteTaskController);


export default router;