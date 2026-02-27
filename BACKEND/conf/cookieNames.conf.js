export const COOKIE_NAMES = {
  ADMIN_ACCESS_TOKEN: "ADMINAccesstoken",
  ADMIN_REFRESH_TOKEN: "ADMINRefreshToken",
  USER_ACCESS_TOKEN: "USERAccesstoken",
  USER_REFRESH_TOKEN: "USERRefreshToken",
};

export const clearCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 0,
  path: "/",
};

export const refreshTokenCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: "/",
};