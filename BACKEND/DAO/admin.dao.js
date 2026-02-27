
import bcrypt from "bcrypt";
import User from "../models/user-admin.model.js";

export const createAdminDao = async (adminData) => {
    try{
        // Check if admin with the same email already exists
        const existingAdmin = await User.findOne({ email: adminData.email });
        if (existingAdmin) {
            throw new Error("Admin with this email already exists");
        }

        // Create new admin        
        const newAdmin = new User({
            name: adminData.name,
            email: adminData.email,
            password: adminData.password,
            role: 'admin'
        });
        await newAdmin.save();
        return newAdmin;
    }catch(error){
        throw new Error(error.message);
    }
}   

export const findAdminByEmail_DAO = async (email) => {
    // Find admin in database
    const admin = await User.findOne({ email, role: 'admin' }).select('+password');
    return admin;
}

export const compareAdminPassword_DAO = async (password, admin) => {
    // Compare password with hashed password in database
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    return isPasswordValid;
}

export const seeAllUsersDao = async () => {
    // Fetch all users (role: 'user') from the database
    const users = await User.find({ role: 'user' });
    return users;
}

export const deleteUserDataDao = async (userId) => {
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) throw new Error("User not found");  // add this
    return deletedUser;
}