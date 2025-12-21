import React from "react";
import { Link } from "react-router-dom";

function StudentDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Student Dashboard</h1>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded p-6">
          <h2 className="text-lg font-semibold">My Courses</h2>
          <p className="text-gray-600 mt-2">
            View enrolled courses & progress
          </p>
          <Link
            to="/my-courses"
            className="inline-block mt-4 text-blue-600"
          >
            View Courses →
          </Link>
        </div>

        <div className="bg-white shadow rounded p-6">
          <h2 className="text-lg font-semibold">Certificates</h2>
          <p className="text-gray-600 mt-2">
            Download completed course certificates
          </p>
          <Link
            to="/certificates"
            className="inline-block mt-4 text-blue-600"
          >
            View Certificates →
          </Link>
        </div>

        <div className="bg-white shadow rounded p-6">
          <h2 className="text-lg font-semibold">Profile</h2>
          <p className="text-gray-600 mt-2">
            Manage your personal information
          </p>
          <Link
            to="/profile"
            className="inline-block mt-4 text-blue-600"
          >
            Go to Profile →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
