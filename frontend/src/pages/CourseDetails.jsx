import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { enrollCourse, courseAPI } from "../services/api";
import { useEffect, useState } from "react";

const CourseDetails = () => {
  const { id } = useParams(); // courseId
  const { token } = useAuth();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [openIndex, setOpenIndex] = useState(null);

  // =========================
  // Fetch course details
  // =========================
  useEffect(() => {
    courseAPI.getCourseById(id).then((res) => {
      setCourse(res.data);
    });
  }, [id]);

  // =========================
  // Fetch my enrollments
  // =========================
  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:5000/api/enrollments/my-enrollments", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data)) return;

        const found = data.find(
          (e) =>
            e.courseId === id ||
            e.courseId?._id === id
        );

        if (found) setEnrollment(found);
      });
  }, [token, id]);

  // =========================
  // ENROLL COURSE
  // =========================
  const handleEnroll = async () => {
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await enrollCourse(id, token);

      if (res.enrollmentId) {
        navigate("/my-courses");
      } else {
        setError(res.message || "Enrollment failed");
      }
    } catch {
      setError("Enrollment error");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // PAYMENT INIT
  // =========================
  const handlePayment = async () => {
    try {
      setError("");

      const res = await fetch(
        "http://localhost:5000/api/payments/init", // ✅ CORRECT ROUTE
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            enrollmentId: enrollment._id,
          }),
        }
      );

      const data = await res.json();

      if (data.paymentUrl) {
        window.location.href = data.paymentUrl; // 🔥 SSLCommerz redirect
      } else {
        setError(data.message || "Payment initiation failed");
      }
    } catch {
      setError("Payment error");
    }
  };

  // =========================
  // LOADING STATE
  // =========================
  if (!course) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-gray-500 text-lg">
          Loading course details...
        </p>
      </div>
    );
  }

  const syllabus = course.syllabus || [
    "Introduction & Overview",
    "Core Concepts",
    "Hands-on Practice",
    "Real-world Project",
    "Final Assessment",
  ];

  // =========================
  // UI
  // =========================
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* LEFT SIDE */}
        <div className="lg:col-span-2">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            {course.title}
          </h1>

          <p className="text-gray-600 text-lg mb-6">
            {course.description}
          </p>

          {/* Meta */}
          <div className="flex flex-wrap gap-4 text-sm mb-8">
            <span className="bg-gray-100 px-3 py-1 rounded-full">
              📂 {course.category || "General"}
            </span>
            <span className="bg-gray-100 px-3 py-1 rounded-full">
              ⏱ {course.duration || 10} hrs
            </span>
            <span className="bg-gray-100 px-3 py-1 rounded-full">
              🎯 {course.level || "Beginner"}
            </span>
            <span className="bg-gray-100 px-3 py-1 rounded-full">
              ⭐ {course.rating || 4.5}
            </span>
          </div>

          {/* SYLLABUS */}
          <div className="mb-10">
            <h3 className="text-2xl font-semibold mb-4">
              Course Syllabus
            </h3>

            <div className="space-y-2">
              {syllabus.map((item, idx) => (
                <div key={idx} className="border rounded-lg">
                  <button
                    className="w-full text-left px-4 py-3 font-medium flex justify-between"
                    onClick={() =>
                      setOpenIndex(openIndex === idx ? null : idx)
                    }
                  >
                    {item}
                    <span>{openIndex === idx ? "−" : "+"}</span>
                  </button>

                  {openIndex === idx && (
                    <div className="px-4 pb-4 text-gray-600 text-sm">
                      Detailed explanation of {item}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* REVIEWS */}
          <div>
            <h3 className="text-2xl font-semibold mb-4">
              Student Reviews
            </h3>

            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                ⭐⭐⭐⭐⭐
                <p className="text-gray-600 text-sm">
                  Excellent course, very practical and easy to follow.
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                ⭐⭐⭐⭐☆
                <p className="text-gray-600 text-sm">
                  Great explanations, learned a lot!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE (PRICE / ACTION) */}
        <div className="bg-white rounded-2xl shadow-lg p-6 h-fit">
          <p className="text-3xl font-bold text-blue-600 mb-4">
            {course.price > 0 ? `৳${course.price}` : "Free"}
          </p>

          {error && (
            <div className="mb-4 bg-red-100 text-red-700 px-4 py-2 rounded">
              {error}
            </div>
          )}

          {/* ACTION LOGIC */}
          {!enrollment ? (
            <button
              onClick={handleEnroll}
              disabled={loading}
              className="w-full py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Enrolling..." : "Enroll Now"}
            </button>
          ) : enrollment.progress === 100 ? (
            <button
              onClick={() => navigate("/certificates")}
              className="w-full py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700"
            >
              🎓 View Certificate
            </button>
          ) : enrollment.paymentStatus !== "completed" ? (
            <button
              onClick={handlePayment}
              className="w-full py-3 rounded-lg bg-orange-500 text-white font-semibold hover:bg-orange-600"
            >
              💳 Complete Payment
            </button>
          ) : (
            <button
              onClick={() =>
                navigate(`/enrollments/${enrollment._id}`)
              }
              className="w-full py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700"
            >
              ▶ Continue Course
            </button>
          )}

          <p className="text-xs text-gray-500 text-center mt-3">
            Lifetime access • Certificate included
          </p>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
