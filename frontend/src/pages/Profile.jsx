import React from "react";
import { useAuth } from "../context/AuthContext";

function Profile() {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white shadow rounded-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          My Profile
        </h1>

        {/* Profile Info */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-500">Full Name</label>
            <p className="text-lg font-medium text-gray-800">
              {user.name}
            </p>
          </div>

          <div>
            <label className="block text-sm text-gray-500">Email</label>
            <p className="text-lg font-medium text-gray-800">
              {user.email}
            </p>
          </div>

          <div>
            <label className="block text-sm text-gray-500">Role</label>
            <span className="inline-block px-3 py-1 rounded bg-blue-100 text-blue-700 font-medium">
              {user.role}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex gap-4">
          <button
            className="bg-gray-200 text-gray-800 px-6 py-2 rounded hover:bg-gray-300"
            disabled
          >
            Edit Profile (Coming Soon)
          </button>

          <button
            onClick={logout}
            className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
