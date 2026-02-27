

import User from "../models/user-admin.model.js";

// Create user
export const createUserDAO = async (userData) => {
  const { name, email, password } = userData;
  const newUser = new User({ name, email, password });
  await newUser.save();
  return newUser;
};

// Find user by email (for login)
export const findUserByEmailDAO = async (email) => {
    const user = await User.findOne({ email });
    return user;
};

// Find user by ID
export const findUserByIdDAO = async (userId) => {   // extra check , possible that user is deleted but jwt is there
  // to be implemented
  const searchedUser = await User.findById(userId);
  if (!searchedUser) throw new Error("User not found");
  return searchedUser;
};

// Update user by ID
export const updateMyProfileDAO = async (userId, updateData) => {
    const updatedUser = await User.findByIdAndUpdate(
        userId,
        updateData,
        { new: true, runValidators: true }
    );
    if (!updatedUser) throw new Error("User not found");
    return updatedUser;
};
