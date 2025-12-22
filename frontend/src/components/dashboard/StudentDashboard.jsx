import React from "react";
import { Link } from "react-router-dom";

function StudentDashboard() {
  return (
    <div className="min-h-screen bg-gray-900 py-12 px-6 sm:px-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-white mb-10 text-center">
          Student Dashboard
        </h1>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Card: My Courses */}
          <div className="bg-gray-800 rounded-3xl shadow-2xl border border-gray-700 p-6 flex flex-col justify-between hover:scale-105 transform transition-all duration-300">
            <div>
              <h2 className="text-xl font-bold text-white">My Courses</h2>
              <p className="text-gray-300 mt-2">
                View enrolled courses & track your progress
              </p>
            </div>
            <Link
              to="/my-courses"
              className="mt-6 inline-flex items-center gap-2 text-indigo-400 font-semibold hover:text-indigo-500 transition"
            >
              View Courses →
            </Link>
          </div>

          {/* Card: Certificates */}
          <div className="bg-gray-800 rounded-3xl shadow-2xl border border-gray-700 p-6 flex flex-col justify-between hover:scale-105 transform transition-all duration-300">
            <div>
              <h2 className="text-xl font-bold text-white">Certificates</h2>
              <p className="text-gray-300 mt-2">
                Download completed course certificates
              </p>
            </div>
            <Link
              to="/certificates"
              className="mt-6 inline-flex items-center gap-2 text-indigo-400 font-semibold hover:text-indigo-500 transition"
            >
              View Certificates →
            </Link>
          </div>

          {/* Card: Profile */}
          <div className="bg-gray-800 rounded-3xl shadow-2xl border border-gray-700 p-6 flex flex-col justify-between hover:scale-105 transform transition-all duration-300">
            <div>
              <h2 className="text-xl font-bold text-white">Profile</h2>
              <p className="text-gray-300 mt-2">
                Manage your personal information
              </p>
            </div>
            <Link
              to="/profile"
              className="mt-6 inline-flex items-center gap-2 text-indigo-400 font-semibold hover:text-indigo-500 transition"
            >
              Go to Profile →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
