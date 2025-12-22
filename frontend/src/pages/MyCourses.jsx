import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const MyCourses = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:5000/api/enrollments/my-enrollments", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setEnrollments(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-gray-500 text-lg">Loading your courses...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">
        🎓 My Courses
      </h2>

      {enrollments.length === 0 ? (
        <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-10 text-center">
          <p className="text-xl font-medium text-gray-700 mb-2">
            You are not enrolled in any courses yet
          </p>
          <p className="text-gray-500 mb-6">
            Explore our courses and start learning today 🚀
          </p>
          <button
            onClick={() => navigate("/courses")}
            className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          >
            Browse Courses
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrollments.map((e) => (
            <div
              key={e._id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-6 flex flex-col justify-between"
            >
              {/* Course Info */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {e.courseTitle}
                </h3>

                {/* Payment Status */}
                <span
                  className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mb-4 ${
                    e.paymentStatus === "completed"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {e.paymentStatus === "completed"
                    ? "Paid"
                    : "Payment Pending"}
                </span>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{e.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-blue-600"
                      style={{ width: `${e.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => navigate(`/enrollments/${e._id}`)}
                className="mt-4 w-full py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
              >
                {e.progress === 100 ? "View Certificate" : "Continue Course"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCourses;
