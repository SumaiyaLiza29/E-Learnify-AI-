import React from "react";
import { useAuth } from "../context/AuthContext";
import StudentDashboard from "../components/dashboard/StudentDashboard";
import InstructorDashboard from "../components/dashboard/InstructorDashboard";
import AdminDashboard from "../components/dashboard/AdminDashboard";

function Dashboard() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-b-4 border-gray-700 mx-auto"></div>
          <p className="mt-4 text-gray-300 text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (user.role === "admin") return <AdminDashboard />;
  if (user.role === "instructor") return <InstructorDashboard />;
  return <StudentDashboard />;
}

export default Dashboard;
