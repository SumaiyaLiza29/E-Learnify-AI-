import React from "react";
import { Link } from "react-router-dom";

function InstructorDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Instructor Dashboard</h1>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded p-6">
          <h2 className="text-lg font-semibold">My Courses</h2>
          <p className="text-gray-600 mt-2">
            Manage your published courses
          </p>
          <Link to="/my-courses" className="text-blue-600 mt-4 inline-block">
            View Courses →
          </Link>
        </div>

        <div className="bg-white shadow rounded p-6">
          <h2 className="text-lg font-semibold">Create New Course</h2>
          <p className="text-gray-600 mt-2">
            Upload and manage course content
          </p>
          <Link
            to="/create-course"
            className="text-blue-600 mt-4 inline-block"
          >
            Create Course →
          </Link>
        </div>

        <div className="bg-white shadow rounded p-6">
          <h2 className="text-lg font-semibold">Earnings</h2>
          <p className="text-gray-600 mt-2">
            Track your course revenue
          </p>
          <span className="inline-block mt-4 text-green-600 font-bold">
            ৳ Coming Soon
          </span>
        </div>
      </div>
    </div>
  );
}

export default InstructorDashboard;
