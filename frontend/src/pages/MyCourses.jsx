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
    <div className="min-h-screen bg-gray-900 py-12 px-6 sm:px-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-white mb-10 text-center">
          My Courses
        </h1>

        {myCourses.length === 0 ? (
          <p className="text-gray-400 text-center">
            You are not enrolled in any course yet.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {myCourses.map((course) => (
              <div
                key={course.id}
                className="bg-gray-800 shadow-2xl border border-gray-700 rounded-3xl p-6 hover:scale-105 transform transition-all duration-300"
              >
                <h2 className="text-xl font-bold text-white">{course.title}</h2>
                <p className="text-gray-300 mt-1">Instructor: {course.instructor}</p>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-400 mb-1">
                    <span>Progress</span>
                    <span>{course.progress}%</span>
                  </div>

                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full ${
                        course.progress === 100 ? "bg-green-500" : "bg-blue-500"
                      }`}
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 flex justify-between items-center flex-wrap gap-2">
                  {course.progress === 100 ? (
                    <span className="text-green-400 font-medium">✅ Course Completed</span>
                  ) : (
                    <Link
                      to={`/course/${course.id}`}
                      className="text-blue-400 hover:underline"
                    >
                      Continue Learning →
                    </Link>
                  )}

                  {course.progress === 100 && (
                    <Link
                      to="/certificates"
                      className="text-sm bg-green-700/20 text-green-400 px-3 py-1 rounded-full hover:bg-green-700/30 transition"
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
    </div>
  );
}

export default MyCourses;
