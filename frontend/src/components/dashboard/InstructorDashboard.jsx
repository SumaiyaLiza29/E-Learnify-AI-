import React from "react";
import { Link } from "react-router-dom";

function InstructorDashboard() {
  return (
    <div className="min-h-screen bg-gray-900 py-12 px-6 sm:px-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-white mb-10 text-center">
          Instructor Dashboard
        </h1>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Card: My Courses */}
          <div className="bg-gray-800 rounded-3xl shadow-2xl border border-gray-700 p-6 flex flex-col justify-between hover:scale-105 transform transition-all duration-300">
            <div>
              <h2 className="text-xl font-bold text-white">My Courses</h2>
              <p className="text-gray-300 mt-2">
                Manage your published courses
              </p>
            </div>
            <Link
              to="/my-courses"
              className="mt-6 inline-flex items-center gap-2 text-indigo-400 font-semibold hover:text-indigo-500 transition"
            >
              View Courses →
            </Link>
          </div>

          {/* Card: Create New Course */}
          <div className="bg-gray-800 rounded-3xl shadow-2xl border border-gray-700 p-6 flex flex-col justify-between hover:scale-105 transform transition-all duration-300">
            <div>
              <h2 className="text-xl font-bold text-white">Create New Course</h2>
              <p className="text-gray-300 mt-2">
                Upload and manage course content
              </p>
            </div>
            <Link
              to="/create-course"
              className="mt-6 inline-flex items-center gap-2 text-indigo-400 font-semibold hover:text-indigo-500 transition"
            >
              Create Course →
            </Link>
          </div>

          {/* Card: Earnings */}
          <div className="bg-gray-800 rounded-3xl shadow-2xl border border-gray-700 p-6 flex flex-col justify-between hover:scale-105 transform transition-all duration-300">
            <div>
              <h2 className="text-xl font-bold text-white">Earnings</h2>
              <p className="text-gray-300 mt-2">
                Track your course revenue
              </p>
            </div>
            <span className="mt-6 inline-block text-green-400 font-bold">
              ৳ Coming Soon
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InstructorDashboard;
