// src/middlewares/admin.middleware.js

export  const adminMiddleware = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. No user context found.",
      });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin privileges required.",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Admin verification failed.",
    });
  }
};


// export const adminCreationGuard = (req, res, next) => {
//     const secret = req.headers['ADMIN_CREATION_SECRET'];
//     if (!secret || secret !== process.env.ADMIN_CREATION_SECRET) {
//         return res.status(403).json({ success: false, message: "Forbidden" });
//     }
//     next();
// };
export const adminCreationGuard = (req, res, next) => {
    const secret = req.headers['admin_creation_secret'];
    if (!secret || secret !== process.env.ADMIN_CREATION_SECRET) {
        return res.status(403).json({ success: false, message: "Forbidden" });
    }
    next();
};

