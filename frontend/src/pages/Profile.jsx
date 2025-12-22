import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Camera, Edit2, Save, X, LogOut, Shield, Mail, User } from "lucide-react";

function Profile() {
  const { user, logout, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    bio: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-300">Loading profile...</p>
        </div>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      setError("Name is required");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      await updateProfile(formData);
      setSuccess("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      setError(err.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      bio: user.bio || "",
    });
    setIsEditing(false);
    setError("");
    setSuccess("");
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-white">My Profile</h1>
          <p className="text-gray-300 mt-2">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Profile Card */}
          <div className="lg:w-1/3">
            <div className="bg-gray-800 rounded-3xl shadow-2xl p-6 border border-gray-700">
              <div className="relative">
                <div className="relative w-40 h-40 mx-auto">
                  <img
                    src={`https://ui-avatars.com/api/?name=${user.name}&background=4f46e5&color=fff&size=256&bold=true&font-size=0.5`}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover border-4 border-gray-700 shadow-xl"
                  />
                  {isEditing && (
                    <button className="absolute bottom-2 right-2 bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 transition shadow-lg">
                      <Camera size={18} />
                    </button>
                  )}
                </div>

                <div className="text-center mt-6">
                  <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                  <p className="text-gray-400 mt-1">{user.email}</p>

                  <div className="mt-4 inline-flex items-center gap-2 bg-indigo-700/20 text-indigo-300 px-4 py-1 rounded-full text-sm font-medium">
                    <Shield size={14} />
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-700 space-y-4">
                  <div className="flex items-center text-gray-400">
                    <Mail size={18} className="mr-3" />
                    <span>Member since</span>
                    <span className="ml-auto font-medium text-gray-200">
                      {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-400">
                    <User size={18} className="mr-3" />
                    <span>Profile Status</span>
                    <span className="ml-auto font-medium text-green-400">Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Profile Details */}
          <div className="lg:w-2/3">
            <div className="bg-gray-800 rounded-3xl shadow-2xl p-6 border border-gray-700">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-white">
                  Personal Information
                </h2>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition shadow-md"
                  >
                    <Edit2 size={18} />
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleCancel}
                      className="inline-flex items-center gap-2 border border-gray-600 text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-700 transition"
                    >
                      <X size={18} />
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={isLoading}
                      className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50 shadow-md"
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save size={18} />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Messages */}
              {error && (
                <div className="mb-6 p-4 bg-red-800/20 border border-red-700 rounded-lg text-red-400">
                  {error}
                </div>
              )}
              {success && (
                <div className="mb-6 p-4 bg-green-800/20 border border-green-700 rounded-lg text-green-400">
                  {success}
                </div>
              )}

              {/* Form Fields */}
              <div className="space-y-6 text-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white"
                        placeholder="Enter your name"
                      />
                    ) : (
                      <p className="text-white font-medium">{user.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Email Address
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white"
                        readOnly
                      />
                    ) : (
                      <p className="text-white font-medium">{user.email}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Email cannot be changed
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Phone Number
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white"
                        placeholder="Enter phone number"
                      />
                    ) : (
                      <p className="text-white font-medium">
                        {user.phone || "Not provided"}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Account Type
                    </label>
                    <div className="inline-flex items-center gap-2 bg-gray-700 px-4 py-2 rounded-lg text-indigo-300 font-medium">
                      <Shield size={16} />
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Bio
                  </label>
                  {isEditing ? (
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white"
                      placeholder="Tell us about yourself..."
                    />
                  ) : (
                    <p className="text-white">{user.bio || "No bio provided"}</p>
                  )}
                </div>
              </div>

              {/* Danger Zone */}
              <div className="mt-12 pt-8 border-t border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">Account Actions</h3>
                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={logout}
                    className="inline-flex items-center gap-2 border border-red-600 text-red-500 px-6 py-3 rounded-lg hover:bg-red-700/20 transition"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>

                  <button
                    disabled
                    className="inline-flex items-center gap-2 border border-gray-600 text-gray-400 px-6 py-3 rounded-lg hover:bg-gray-700/20 transition cursor-not-allowed opacity-50"
                  >
                    <Shield size={18} />
                    Change Password (Coming Soon)
                  </button>

                  <button
                    disabled
                    className="inline-flex items-center gap-2 border border-gray-600 text-gray-400 px-6 py-3 rounded-lg hover:bg-gray-700/20 transition cursor-not-allowed opacity-50"
                  >
                    Delete Account (Coming Soon)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
