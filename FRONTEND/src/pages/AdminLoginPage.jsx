import { useState } from "react";
import { useNavigate, Link } from "@tanstack/react-router";
import axiosInstance from "../utility/axiosInstance.js";
import LoginButtonOnAdminPage from "../components/LoginButtonOnAdminPage";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await axiosInstance.post('/api/v1/admin_route/login_admin', form)
      const data = response.data

      if (data.success) {
        localStorage.removeItem('userToken');
        localStorage.setItem('adminToken', data.admin.token || 'authenticated')
        localStorage.setItem('role', data.admin.user.role)
        navigate({ to: '/admin/dashboard' })
      }
    } catch (error) {
      setError(error.response?.data?.message || "Login failed. Please try again.")
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">

        <h2 className="text-3xl font-bold text-center text-gray-800">Admin Login</h2>
        <p className="text-center text-gray-500 mt-2">
          Restricted access – admins only
        </p>

        {error && (
          <div className="mt-4 px-4 py-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="block text-gray-600 font-medium">Admin Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter admin email"
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter password"
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
              required
            />
          </div>

          <LoginButtonOnAdminPage loading={loading} />

        </form>

        <p className="text-center text-gray-600 mt-6">
          Go back to{" "}
          <Link to="/" className="text-blue-600 font-semibold">
            Homepage
          </Link>
        </p>

      </div>
    </div>
  );
}