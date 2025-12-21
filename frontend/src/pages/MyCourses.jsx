import React from "react";
import { Link } from "react-router-dom";

// Temporary dummy data (later backend API দিয়ে replace হবে)
const myCourses = [
  {
    id: "1",
    title: "Complete MERN Stack Development",
    instructor: "John Doe",
    progress: 65,
  },
  {
    id: "2",
    title: "Data Structures & Algorithms",
    instructor: "Jane Smith",
    progress: 100,
  },
];

function MyCourses() {
  return (
    <div className="p-8 min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">My Courses</h1>

      {myCourses.length === 0 ? (
        <p className="text-gray-600">You are not enrolled in any course yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {myCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white shadow rounded-lg p-6"
            >
              <h2 className="text-xl font-semibold text-gray-800">
                {course.title}
              </h2>

              <p className="text-gray-600 mt-1">
                Instructor: {course.instructor}
              </p>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Progress</span>
                  <span>{course.progress}%</span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full ${
                      course.progress === 100
                        ? "bg-green-500"
                        : "bg-blue-500"
                    }`}
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex justify-between items-center">
                {course.progress === 100 ? (
                  <span className="text-green-600 font-medium">
                    ✅ Course Completed
                  </span>
                ) : (
                  <Link
                    to={`/course/${course.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    Continue Learning →
                  </Link>
                )}

                {course.progress === 100 && (
                  <Link
                    to="/certificates"
                    className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded"
                  >
                    View Certificate
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyCourses;
