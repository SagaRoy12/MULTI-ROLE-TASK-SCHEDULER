import { createUserDAO, findUserByEmailDAO, findUserByIdDAO, updateMyProfileDAO } from "../DAO/user.dao.js";
import { createTaskDAO, getMyTasksDAO, getSingleTaskDAO, updateTaskDAO, deleteTaskDAO } from "../DAO/task.dao.js";
import { signedJsonWebToken, signedRefreshToken } from "../jwt/jwtSign.js"
import bcrypt from "bcrypt";
// USER AUTH SERVICE

// Create User
export const createUserService = async (userData) => {
  const { name, email, password } = userData;
  if (!name || !email || !password) {
    throw new Error("Name, email and password are required");
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    throw new Error("Invalid email format");
  }
  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }
  const newUser = await createUserDAO(userData);
  return newUser;
};

// Login User
export const loginUserService = async (loginData) => {
  const { email, password } = loginData;
  if (!email || !password) {
    throw new Error("Email and password are required");
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    throw new Error("Invalid email format");
  }
  const user = await findUserByEmailDAO(email);
  if (!user) {
    throw new Error("User not found");
  }
  const token = await signedJsonWebToken({
    id: user._id,
    email: user.email,
    role: user.role
  });

  const refreshToken = await signedRefreshToken({
    id: user._id,
    role: user.role
  });

  return {
    token,
    refreshToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  }
}


// USER PROFILE SERVICES

// Get My Profile
export const getMyProfileService = async (userId) => {
  const userProfile = await findUserByIdDAO(userId);
  return userProfile;
};

// Update My Profile
export const updateMyProfileService = async (userId, updateData) => {
    const { name, email, password } = updateData;

    if (email && !/^\S+@\S+\.\S+$/.test(email)) {
        throw new Error("Invalid email format");
    }
    if (password && password.length < 6) {
        throw new Error("Password must be at least 6 characters");
    }

    // if the password field is there then update and save as hashed 
    if (password) {
        const salt = await bcrypt.genSalt(10);
        updateData.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await updateMyProfileDAO(userId, updateData);
    return updatedUser;
};


// USER TASK SERVICES


// Create Task
  export const createTaskService = async (userId, taskData) => {
    const { title } = taskData;

    if (!title) {
        throw new Error("Title is required");
    }
    if (title.length < 2) {
        throw new Error("Title must be at least 2 characters");
    }

    const newTask = await createTaskDAO(userId, taskData);
    return newTask;
};

export const getMyTasksService = async (userId) => {
    const tasks = await getMyTasksDAO(userId);
    return tasks;
};

export const getSingleTaskService = async (userId, taskId) => {
    const task = await getSingleTaskDAO(userId, taskId);
    if (!task) throw new Error("Task not found");
    return task;
};

export const updateTaskService = async (userId, taskId, updateData) => {
    const { title } = updateData;

    if (title && title.length < 2) {
        throw new Error("Title must be at least 2 characters");
    }

    const updatedTask = await updateTaskDAO(userId, taskId, updateData);
    if (!updatedTask) throw new Error("Task not found");
    return updatedTask;
};

export const deleteTaskService = async (userId, taskId) => {
    const deletedTask = await deleteTaskDAO(userId, taskId);
    if (!deletedTask) throw new Error("Task not found");
    return deletedTask;
};