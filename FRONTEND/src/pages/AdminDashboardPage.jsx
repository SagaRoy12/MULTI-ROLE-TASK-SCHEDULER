import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import axiosInstance from "../utility/axiosInstance.js";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) navigate({ to: "/admin/login" });
  }, []);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await axiosInstance.post("/api/v1/admin_route/logout_admin");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("role");
      navigate({ to: "/admin/login" });
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">

      {/* SIDEBAR */}
      <aside className="w-64 bg-white shadow-lg p-6 flex flex-col">
        <h2 className="text-2xl font-bold text-gray-800">Admin Panel</h2>

        <nav className="mt-8 flex flex-col gap-5">
          <Link
            to="/admin/dashboard/users"
            className="text-gray-700 hover:text-blue-600 text-lg"
          >
            👥 All Users
          </Link>

          <Link
            to="/admin/dashboard/tasks"
            className="text-gray-700 hover:text-blue-600 text-lg"
          >
            📝 All Tasks
          </Link>

          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="mt-10 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition disabled:opacity-50"
          >
            {isLoggingOut ? "Logging out..." : "Logout"}
          </button>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-10">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome, Admin 👋
        </h1>
        <p className="text-gray-600 mt-2">
          Manage users, view tasks, and control the system from this dashboard.
        </p>

        {/* DASHBOARD CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">

          {/* MANAGE USERS */}
          <div className="bg-white shadow-md border rounded-xl p-6">
            <h3 className="text-xl font-semibold text-gray-800">👥 All Users</h3>
            <p className="text-gray-600 mt-2">
              View and delete registered users.
            </p>

            <Link
              to="/admin/dashboard/users"
              className="text-blue-600 mt-4 inline-block font-semibold"
            >
              Manage Users →
            </Link>
          </div>

          {/* MANAGE TASKS */}
          <div className="bg-white shadow-md border rounded-xl p-6">
            <h3 className="text-xl font-semibold text-gray-800">📝 All Tasks</h3>
            <p className="text-gray-600 mt-2">
              View all tasks created by users.
            </p>

            <Link
              to="/admin/dashboard/tasks"
              className="text-blue-600 mt-4 inline-block font-semibold"
            >
              View Tasks →
            </Link>
          </div>

          {/* SYSTEM SETTINGS (optional) */}
          <div className="bg-white shadow-md border rounded-xl p-6">
            <h3 className="text-xl font-semibold text-gray-800">⚙️ System</h3>
            <p className="text-gray-600 mt-2">
              Advanced admin controls (coming soon).
            </p>

            <button className="text-blue-600 mt-4 font-semibold">
              Open →
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}