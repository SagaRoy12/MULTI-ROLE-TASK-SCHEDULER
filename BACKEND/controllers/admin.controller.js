import { adminLoginService, seeAllUsersService, deleteUserService, createAdminService } from "../service/admin.service.js";
import { cookieOptions } from "../conf/cookies.conf.js";


export const createAdminController = async (req, res) => {
   const adminData = req.body;
   try{
    const newCreatedAdmin = await createAdminService(adminData);
    res.status(201).json({
        success: true,
        message: "Admin created successfully",
        admin: newCreatedAdmin
    })
   }catch(error){
    res.status(400).json({
        success: false,
        message: `CONTROLLER ERRRO || createAdminController: ${error.message}`
    })
   }
}

// admin login controller
export const loginAdminController = async (req, res) => {
   const data = req.body;
   try{
    const admin = await adminLoginService(data);
    const { token, user } = admin;
    res.cookie("ADMINAccesstoken", token, cookieOptions);
    return(res.status(200).json({
        success: true,
        message: "Admin logged in successfully",
        admin
    }))
   }catch(error){
    res.status(400).json({
        success: false,
        message: error.message
    })
   }
}


// admin see all users controller
export const seeAllUsersController = async (req, res) => {
    try{
        const users = await seeAllUsersService();
        res.status(200).json({
            success: true,            
            message: "All users retrieved successfully",
            users
        })
    }catch(error){
        res.status(400).json({
            success: false, 
            message: error.message
        })
    }
}

// admin delete user controller
export const deleteUserController = async (req, res) => {
    const userId = req.params.id;
    try{
        const deletedUser = await deleteUserService(userId);
        res.status(200).json({
            success: true,  
            message: "User deleted successfully",
            deletedUser
        })
    }catch(error){
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}