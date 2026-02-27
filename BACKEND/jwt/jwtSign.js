import jsonwebtoken from "jsonwebtoken";

const jwtOptions = {
    expiresIn: "1h" // 1 hour
}

const refreshTokenOptions = {
    expiresIn: "7d" // 7 days for refresh token
}

export const signedJsonWebToken = async (payload) => {
    return jsonwebtoken.sign(payload, process.env.JWT_SECRET, jwtOptions)
}

export const signedRefreshToken = async (payload) => {
    return jsonwebtoken.sign(payload, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET, refreshTokenOptions)
}