import { Router } from "express";
import { createAdminController, loginAdminController, seeAllUsersController , deleteUserController} from "../controllers/admin.controller.js";
import {adminMiddleware , adminCreationGuard} from "../middlewares/admin.middleware.js";
import authMiddleware from "../middlewares/auth.middleware.js";
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

export default router;