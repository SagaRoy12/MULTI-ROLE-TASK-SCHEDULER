import { createAdminDao, findAdminByEmail_DAO, compareAdminPassword_DAO, seeAllUsersDao, deleteUserDataDao } from "../DAO/admin.dao.js";
import { signedJsonWebToken } from "../jwt/jwtSign.js"


export const createAdminService = async (adminData) => {
    
        const { name, email, password } = adminData;

        if (!name || !email || !password) {
            throw new Error("Name, email, and password are required");
        }
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            throw new Error("Invalid email format");
        }
        if (password.length < 6) {
            throw new Error("Password must be at least 6 characters");
        }
        const newAdmin = await createAdminDao(adminData);
        return newAdmin;
    
}


export const adminLoginService = async (data) => {
    // Find admin in database
    const { email, password } = data;
    const admin = await findAdminByEmail_DAO(email);
    if (!admin) {
        throw { status: 401, message: 'Invalid credentials' };
    }

    // Verifying password
    const isPasswordValid = await compareAdminPassword_DAO(password, admin);
    if (!isPasswordValid) {
        throw { status: 401, message: 'Invalid credentials' };
    }

    // Creating token with role
    const token = await signedJsonWebToken({
        id: admin._id,
        email: admin.email,
        role: 'admin'
    });

    // Return token and user data
    return {
        token,
        user: {
            id: admin._id,
            name: admin.name,
            email: admin.email,
            role: 'admin'
        }
    };
};

export const seeAllUsersService = async () => {
    try {
        const users = await seeAllUsersDao();
        return users;
    } catch (error) {
        throw new Error(error.message);
    }
}

export const deleteUserService = async (userId) => {
    try {
        const deletedUser = await deleteUserDataDao(userId);
        return deletedUser;
    } catch (error) {
        throw new Error(error.message);
    }
}