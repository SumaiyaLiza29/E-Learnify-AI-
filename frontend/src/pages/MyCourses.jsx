import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const MyCourses = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(null);

  useEffect(() => {
    if (!token) return;
    fetchMyEnrollments();
  }, [token]);

  const fetchMyEnrollments = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/enrollments/my-enrollments",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      setEnrollments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch enrollments error:", err);
      setEnrollments([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "Recently";
    return new Date(date).toLocaleDateString();
  };

  const downloadInvoice = (enrollmentId) => {
    if (!token) return;
    setDownloading(enrollmentId);

    // 🔥 Direct PDF download (NO invoice check)
    window.open(
      `http://localhost:5000/api/invoices/download/${enrollmentId}`,
      "_blank"
    );

    setTimeout(() => setDownloading(null), 1500);
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-b-2 border-blue-600 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold mb-8">🎓 My Courses</h2>

      {enrollments.length === 0 ? (
        <div className="text-center bg-gray-50 p-10 rounded-xl border">
          <p className="text-xl mb-4">You are not enrolled in any courses</p>
          <button
            onClick={() => navigate("/courses")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg"
          >
            Browse Courses
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrollments.map((e) => (
            <div
              key={e._id}
              className="bg-white rounded-xl shadow border overflow-hidden"
            >
              <div className="p-6 border-b">
                <h3 className="text-xl font-semibold mb-3">
                  {e.course?.title || e.courseTitle || "Course"}
                </h3>

                <div className="flex items-center gap-2 mb-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      e.paymentStatus === "completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {e.paymentStatus === "completed"
                      ? "Paid"
                      : "Payment Pending"}
                  </span>
                  {e.paymentStatus === "completed" && (
                    <span className="text-xs text-gray-500">
                      Enrolled on {formatDate(e.createdAt)}
                    </span>
                  )}
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span className="font-semibold">{e.progress || 0}%</span>
                  </div>
                  <div className="w-full bg-gray-200 h-2 rounded-full">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${e.progress || 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-3">
                <button
                  onClick={() => navigate(`/enrollments/${e._id}`)}
                  className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold"
                >
                  {e.progress === 100
                    ? "View Certificate"
                    : "Continue Learning"}
                </button>

                {e.paymentStatus === "completed" && (
                  <button
                    onClick={() => downloadInvoice(e._id)}
                    disabled={downloading === e._id}
                    className="w-full py-2 border rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    {downloading === e._id
                      ? "Downloading..."
                      : "Download Invoice"}
                  </button>
                )}

                {e.paymentStatus !== "completed" && (
                  <button
                    onClick={() =>
                      navigate(`/enrollments/${e._id}/payment`)
                    }
                    className="w-full py-2 text-blue-600 font-medium"
                  >
                    Complete Payment →
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCourses;
