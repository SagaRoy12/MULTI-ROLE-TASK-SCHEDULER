// src/components/RegisterButton.jsx

import { Link } from "@tanstack/react-router";

export default function RegisterButton() {
  return (
    <Link
      to="/register"
      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
    >
      Register
    </Link>
  );
}