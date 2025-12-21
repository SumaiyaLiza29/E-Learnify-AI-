import React from "react";

function AdminDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white shadow rounded p-6">
          <h2 className="text-lg font-semibold">Total Users</h2>
          <p className="text-2xl font-bold mt-2">--</p>
        </div>

        <div className="bg-white shadow rounded p-6">
          <h2 className="text-lg font-semibold">Total Courses</h2>
          <p className="text-2xl font-bold mt-2">--</p>
        </div>

        <div className="bg-white shadow rounded p-6">
          <h2 className="text-lg font-semibold">Total Enrollments</h2>
          <p className="text-2xl font-bold mt-2">--</p>
        </div>

        <div className="bg-white shadow rounded p-6">
          <h2 className="text-lg font-semibold">Revenue</h2>
          <p className="text-2xl font-bold mt-2">৳ --</p>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
