
import { createUserService, loginUserService, getMyProfileService, updateMyProfileService, createTaskService, getMyTasksService, getSingleTaskService, updateTaskService, deleteTaskService } from "../service/user.service.js"
import { cookieOptions } from "../conf/cookies.conf.js";

// Register User
export const createUserController = async (req, res) => {
  try {
    const userData = req.body;
    const newCreatedUser = await createUserService(userData);
    return res.status(201).json({
      message: "User registered successfully",
      user: newCreatedUser
    });

  } catch (error) {
    return res.status(500).json({
      message: `CONTROLLER ERROR || createUserController: ${error.message}`
    });
  }
};

// Login User
export const loginUserController = async (req, res) => {
  try {
    const loginData = req.body;
    const loginResult = await loginUserService(loginData);
    const { token, user } = loginResult;
   
    res.cookie("USERAccesstoken", token, cookieOptions);
    return res.status(200).json({
      message: "User logged in successfully",
      user: loginResult
    });
  } catch (error) {
    return res.status(500).json({
      message: `CONTROLLER ERROR || loginUserController: ${error.message}`
    });
  }
};


// USER PROFILE CONTROLLERS

// Get My Profile
export const getMyProfileController = async (req, res) => {
  try {
    const userId = req.user.id;
    const userProfile = await getMyProfileService(userId);
    if (!userProfile) {
      return res.status(404).json({ message: "User profile not found" });
    }
    return res.status(200).json({
      message: "User profile retrieved successfully",
      user: userProfile
    });
  } catch (error) {
    return res.status(500).json({ message: "Error in getMyProfileController" });
  }
};

// Update My Profile
export const updateMyProfileController = async (req, res) => {
  try {
    const userId = req.user.id;
    const updateData = req.body;

    const updatedUser = await updateMyProfileService(userId, updateData);

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    return res.status(error.status || 400).json({
      success: false,
      message: `Error in updateMyProfileController: ${error.message}`,
    });
  }
};


// TASK CONTROLLERS 

// Create Task
export const createTaskController = async (req, res) => {
  try {
    const userId = req.user.id;
    const taskData = req.body;
    const newTask = await createTaskService(userId, taskData);
    return res.status(201).json({
      success: true,
      message: "Task created successfully",
      task: newTask,
    });
  } catch (error) {
    return res.status(error.status || 400).json({
      success: false,
      message: error.message,
    });
  }
}



// Get My Tasks
export const getMyTasksController = async (req, res) => {
  try {
    const userId = req.user.id;
    const tasks = await getMyTasksService(userId);
    return res.status(200).json({
      success: true,
      message: "Tasks retrieved successfully",
      tasks,
    });
  } catch (error) {
    return res.status(error.status || 400).json({
      success: false,
      message: error.message,
    });
  }
};



// Get Single Task

export const getSingleTaskController = async (req, res) => {
  try {
    const userId = req.user.id;
    const taskId = req.params.id;
    const task = await getSingleTaskService(userId, taskId);
    return res.status(200).json({
      success: true,
      message: "Task retrieved successfully",
      task,
    });
  } catch (error) {
    return res.status(error.status || 400).json({
      success: false,
      message: error.message,
    });
  }
};



  // Update Task

export const updateTaskController = async (req, res) => {
  try {
    const userId = req.user.id;
    const taskId = req.params.id;
    const updateData = req.body;
    const updatedTask = await updateTaskService(userId, taskId, updateData);
    return res.status(200).json({
      success: true,
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    return res.status(error.status || 400).json({
      success: false,
      message: error.message,
    });
  }
};




// Delete Task

export const deleteTaskController = async (req, res) => {
  try {
    const userId = req.user.id;
    const taskId = req.params.id;
    const deletedTask = await deleteTaskService(userId, taskId);
    return res.status(200).json({
      success: true,
      message: "Task deleted successfully",
      task: deletedTask,
    });
  } catch (error) {
    return res.status(error.status || 400).json({
      success: false,
      message: error.message,
    });
  }
};