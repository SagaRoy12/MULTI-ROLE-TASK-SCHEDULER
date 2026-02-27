import {
  createRouter,
  createRoute,
  createRootRoute,
  redirect,
} from "@tanstack/react-router";

import Homepage from "../pages/Homepage.jsx";
import RegisterPage from "../pages/RegisterPage.jsx";
import LoginPage from "../pages/UserLoginPage.jsx";
import AdminLoginPage from "../pages/AdminLoginPage.jsx";
import AdminDashboard from "../pages/AdminDashboardPage.jsx";
import AllUsersPage from "../pages/AdminSeeAllUserPage.jsx";
import UserDashboard from "../pages/UserDashboardPage.jsx";

// root route
const rootRoute = createRootRoute();

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Homepage,
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/register",
  component: RegisterPage,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});

const adminLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/login",
  component: AdminLoginPage,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: UserDashboard,
  beforeLoad: () => {
    const token = localStorage.getItem("userToken");
    if (!token) throw redirect({ to: "/login" });
  },
});

const adminDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/dashboard",
  component: AdminDashboard,
  beforeLoad: () => {
    const role = localStorage.getItem("role");
    if (!role || role !== "admin") throw redirect({ to: "/admin/login" });
  },
});

const allUsersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/dashboard/users",
  component: AllUsersPage,
  beforeLoad: () => {
    const role = localStorage.getItem("role");
    if (!role || role !== "admin") throw redirect({ to: "/admin/login" });
  },
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  registerRoute,
  loginRoute,
  adminLoginRoute,
  dashboardRoute,
  adminDashboardRoute,
  allUsersRoute,
]);

export const router = createRouter({ routeTree });