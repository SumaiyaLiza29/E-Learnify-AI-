import React from "react";

function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-900 py-12 px-6 sm:px-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-white mb-10 text-center">
          Admin Dashboard
        </h1>

        <div className="grid md:grid-cols-4 gap-8">
          {/* Total Users */}
          <div className="bg-gray-800 rounded-3xl shadow-2xl border border-gray-700 p-6 flex flex-col items-center justify-center hover:scale-105 transform transition-all duration-300">
            <h2 className="text-xl font-bold text-white">Total Users</h2>
            <p className="text-3xl font-extrabold text-indigo-400 mt-2">--</p>
          </div>

          {/* Total Courses */}
          <div className="bg-gray-800 rounded-3xl shadow-2xl border border-gray-700 p-6 flex flex-col items-center justify-center hover:scale-105 transform transition-all duration-300">
            <h2 className="text-xl font-bold text-white">Total Courses</h2>
            <p className="text-3xl font-extrabold text-indigo-400 mt-2">--</p>
          </div>

          {/* Total Enrollments */}
          <div className="bg-gray-800 rounded-3xl shadow-2xl border border-gray-700 p-6 flex flex-col items-center justify-center hover:scale-105 transform transition-all duration-300">
            <h2 className="text-xl font-bold text-white">Total Enrollments</h2>
            <p className="text-3xl font-extrabold text-indigo-400 mt-2">--</p>
          </div>

          {/* Revenue */}
          <div className="bg-gray-800 rounded-3xl shadow-2xl border border-gray-700 p-6 flex flex-col items-center justify-center hover:scale-105 transform transition-all duration-300">
            <h2 className="text-xl font-bold text-white">Revenue</h2>
            <p className="text-3xl font-extrabold text-green-400 mt-2">৳ --</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
