import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-blue-600">
          E-learnify
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/dashboard" className="text-gray-700 hover:text-blue-600">
            Dashboard
          </Link>

          {user && (
            <Link to="/profile" className="text-gray-700 hover:text-blue-600">
              Profile
            </Link>
          )}

          {/* Instructor Menu */}
          {user?.role === "instructor" && (
            <Link
              to="/create-course"
              className="text-gray-700 hover:text-blue-600"
            >
              Create Course
            </Link>
          )}

          {/* Admin Menu */}
          {user?.role === "admin" && (
            <Link to="/admin" className="text-gray-700 hover:text-blue-600">
              Admin
            </Link>
          )}

          {!user ? (
            <>
              <Link
                to="/login"
                className="text-gray-700 hover:text-blue-600"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-gray-700"
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden px-6 pb-4 space-y-3">
          <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
            Dashboard
          </Link>

          {user && (
            <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
              Profile
            </Link>
          )}

          {user?.role === "instructor" && (
            <Link to="/create-course" onClick={() => setIsMenuOpen(false)}>
              Create Course
            </Link>
          )}

          {user?.role === "admin" && (
            <Link to="/admin" onClick={() => setIsMenuOpen(false)}>
              Admin
            </Link>
          )}

          {!user ? (
            <>
              <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                Login
              </Link>
              <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                Sign Up
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="block w-full text-left text-red-600"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
