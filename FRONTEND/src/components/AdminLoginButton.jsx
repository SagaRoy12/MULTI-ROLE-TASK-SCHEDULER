import { Link } from "@tanstack/react-router";

export default function AdminLoginButton() {
  return (
    <Link
      to="/admin/login"
      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
    >
      Login as Admin
    </Link>
  );
}