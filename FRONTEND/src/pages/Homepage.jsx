// src/pages/HomePage.jsx
import RegisterButton from "../components/registerButton";
import AdminLoginButton from "../components/AdminLoginButton";  
import { Link } from "@tanstack/react-router";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">

      {/* NAVBAR */}
      <header className="w-full flex justify-between items-center px-6 py-4 bg-white shadow">
        <h1 className="text-2xl font-bold text-gray-800">TaskFlow</h1>

        <nav className="flex gap-4">
           <RegisterButton/>
        </nav>
      </header>


      {/* HERO SECTION */}
      <section className="flex flex-col items-center justify-center flex-grow text-center px-4 py-16">
        <h2 className="text-4xl font-extrabold text-gray-800">
          Manage Your Tasks
        </h2>

        <p className="text-xl text-gray-600 mt-2">
          Simply and Efficiently
        </p>

        <p className="text-gray-500 mt-4 max-w-lg">
          Organize your work, track progress and stay productive every day.
        </p>

        {/* TWO LOGIN BUTTONS */}
        <div className="mt-8 flex gap-4">
          <AdminLoginButton/>

          <Link
            to="/login"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg text-lg hover:bg-blue-700 transition"
          >
            Login as Client
          </Link>
        </div>
      </section>


      


      {/* FOOTER */}
      <footer className="text-center py-4 text-gray-500 bg-white shadow-inner">
        © 2026 TaskFlow
      </footer>

    </div>
  );
}