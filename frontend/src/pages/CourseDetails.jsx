import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { courseAPI } from "../services/api";
import { useEffect, useState } from "react";

const BACKEND_URL = "http://localhost:5000";

const CourseDetails = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  /* =========================
     LOAD COURSE
  ========================= */
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await courseAPI.getCourseById(id);
        setCourse(res.data);
      } catch (err) {
        setError("Failed to load course details");
      }
    };
    fetchCourse();
  }, [id]);

  /* =========================
     LOAD ENROLLMENT
  ========================= */
  const fetchEnrollment = async () => {
    if (!token) return;

    try {
      const res = await fetch(
        `${BACKEND_URL}/api/enrollments/my-enrollments`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();

      if (!Array.isArray(data)) return;

      const found = data.find((e) =>
        typeof e.courseId === "string"
          ? e.courseId === id
          : e.courseId?._id === id
      );

      if (found) setEnrollment(found);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEnrollment();
  }, [token, id]);

  /* =========================
     ENROLL
  ========================= */
  const handleEnroll = async () => {
    if (!token) {
      navigate("/login", { state: { from: `/courses/${id}` } });
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${BACKEND_URL}/api/enrollments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ courseId: id }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Enrollment failed");

      setEnrollment({
        _id: data.enrollmentId || data._id,
        courseId: id,
        paymentStatus: "pending",
      });
      setShowPaymentModal(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     PAYMENT
  ========================= */
  const handlePayment = async () => {
    if (!enrollment?._id) return;

    try {
      setLoading(true);
      const res = await fetch(`${BACKEND_URL}/api/payments/init`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ enrollmentId: enrollment._id }),
      });

      const data = await res.json();
      if (!res.ok || !data.paymentUrl)
        throw new Error("Payment init failed");

      window.open(data.paymentUrl, "_blank");
      setShowPaymentModal(false);
      setSuccessMessage("Complete payment in the opened window");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     LOADING STATE
  ========================= */
  if (!course) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-gray-500">Loading course details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {error && (
        <div className="mb-4 bg-red-100 text-red-700 p-3 rounded">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="mb-4 bg-green-100 text-green-700 p-3 rounded">
          {successMessage}
        </div>
      )}

      {/* THUMBNAIL */}
      {course.thumbnailUrl ? (
        <img
          src={`${BACKEND_URL}/${course.thumbnailUrl}`}
          alt={course.title}
          className="w-full h-64 object-cover rounded-xl mb-6"
        />
      ) : (
        <div className="w-full h-64 bg-gray-200 rounded-xl mb-6 flex items-center justify-center">
          <span className="text-gray-500">No Thumbnail</span>
        </div>
      )}

      {/* TITLE */}
      <h1 className="text-3xl font-bold mb-3">{course.title}</h1>
      <p className="text-gray-600 mb-6">{course.description}</p>

      {/* INSTRUCTOR (FIXED) */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
          <span className="text-blue-600 font-semibold">
            {course.instructorName?.[0] || "I"}
          </span>
        </div>
        <div>
          <p className="font-medium">
            {course.instructorName || "Instructor"}
          </p>
          <p className="text-sm text-gray-500">Course Instructor</p>
        </div>
      </div>

      {/* PRICE */}
      <div className="mb-6">
        {course.price > 0 ? (
          <span className="text-2xl font-bold">৳{course.price}</span>
        ) : (
          <span className="text-2xl font-bold text-green-600">Free</span>
        )}
      </div>

      {/* ACTION */}
      {!enrollment ? (
        <button
          onClick={handleEnroll}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
        >
          {loading ? "Processing..." : "Enroll Now"}
        </button>
      ) : enrollment.paymentStatus !== "completed" ? (
        <button
          onClick={() => setShowPaymentModal(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold"
        >
          Pay Now
        </button>
      ) : (
        <button
          onClick={() => navigate("/my-courses")}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold"
        >
          Start Learning
        </button>
      )}

      {/* PAYMENT MODAL */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Complete Payment</h2>
            <button
              onClick={handlePayment}
              className="w-full bg-green-600 text-white py-3 rounded-lg mb-3"
            >
              Proceed to Payment
            </button>
            <button
              onClick={() => setShowPaymentModal(false)}
              className="w-full bg-gray-200 py-3 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetails;
