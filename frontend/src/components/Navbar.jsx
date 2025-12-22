import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setIsMenuOpen(false);
  };

  const navItem =
    "text-slate-600 hover:text-indigo-600 font-medium transition-colors";

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-extrabold tracking-tight text-indigo-600"
        >
          E-learnify
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/dashboard" className={navItem}>
            Dashboard
          </Link>

          {user && (
            <Link to="/profile" className={navItem}>
              Profile
            </Link>
          )}

          {user?.role === "instructor" && (
            <Link to="/create-course" className={navItem}>
              Create Course
            </Link>
          )}

          {user?.role === "admin" && (
            <Link to="/admin" className={navItem}>
              Admin Panel
            </Link>
          )}

          {!user ? (
            <>
              <Link to="/login" className={navItem}>
                Login
              </Link>
              <Link
                to="/register"
                className="px-5 py-2 rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="px-5 py-2 rounded-full bg-rose-500 text-white font-semibold hover:bg-rose-600 transition"
            >
              Logout
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-slate-700 text-2xl"
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="md:hidden mx-4 mb-4 rounded-2xl bg-white/90 backdrop-blur-xl shadow-xl border border-slate-200 p-6 space-y-4"
          >
            <Link
              to="/dashboard"
              onClick={() => setIsMenuOpen(false)}
              className="block text-slate-700 font-medium"
            >
              Dashboard
            </Link>

            {user && (
              <Link
                to="/profile"
                onClick={() => setIsMenuOpen(false)}
                className="block text-slate-700 font-medium"
              >
                Profile
              </Link>
            )}

            {user?.role === "instructor" && (
              <Link
                to="/create-course"
                onClick={() => setIsMenuOpen(false)}
                className="block text-slate-700 font-medium"
              >
                Create Course
              </Link>
            )}

            {user?.role === "admin" && (
              <Link
                to="/admin"
                onClick={() => setIsMenuOpen(false)}
                className="block text-slate-700 font-medium"
              >
                Admin Panel
              </Link>
            )}

            <div className="pt-3 border-t border-slate-200">
              {!user ? (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block mb-3 text-indigo-600 font-semibold"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-center px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold"
                  >
                    Sign Up
                  </Link>
                </>
              ) : (
                <button
                  onClick={handleLogout}
                  className="w-full text-left text-rose-600 font-semibold"
                >
                  Logout
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;
