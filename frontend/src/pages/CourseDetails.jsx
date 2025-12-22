import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { courseAPI } from "../services/api";
import { useEffect, useState } from "react";

const CourseDetails = () => {
  const { id } = useParams();
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [invoiceLoading, setInvoiceLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Check for payment success from URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const paymentStatus = searchParams.get("payment");
    const enrollmentId = searchParams.get("enrollmentId");

    if (paymentStatus === "success" && enrollmentId) {
      setSuccessMessage("Payment successful! You can now access the course.");
      // Refresh enrollment data
      fetchEnrollment();
    }
  }, [location]);

  // =========================
  // LOAD COURSE
  // =========================
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

  // =========================
  // LOAD ENROLLMENT
  // =========================
  const fetchEnrollment = async () => {
    if (!token) return;

    try {
      const response = await fetch(
        "http://localhost:5000/api/enrollments/my-enrollments",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch enrollments");
      }

      const data = await response.json();

      if (!Array.isArray(data)) return;

      const found = data.find((e) => {
        if (typeof e.courseId === "string") {
          return e.courseId === id;
        } else if (e.courseId && e.courseId._id) {
          return e.courseId._id === id;
        }
        return false;
      });

      if (found) {
        setEnrollment(found);
      }
    } catch (err) {
      console.error("Error fetching enrollment:", err);
    }
  };

  useEffect(() => {
    fetchEnrollment();
  }, [token, id]);

  // =========================
  // ENROLL COURSE
  // =========================
  const handleEnroll = async () => {
    if (!token) {
      navigate("/login", { state: { from: `/courses/${id}` } });
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await fetch("http://localhost:5000/api/enrollments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ courseId: id }),
      });

      const data = await res.json();
      console.log("ENROLL RESPONSE:", data);

      if (!res.ok) {
        throw new Error(data.message || "Enrollment failed");
      }

      // Save enrollment and open payment modal
      const newEnrollment = {
        _id: data.enrollmentId || data._id,
        courseId: id,
        paymentStatus: "pending",
      };

      setEnrollment(newEnrollment);
      setShowPaymentModal(true);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to enroll in course");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // INITIATE PAYMENT
  // =========================
  const handlePayment = async () => {
    if (!enrollment?._id) {
      setError("Enrollment not found. Please try enrolling again.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await fetch("http://localhost:5000/api/payments/init", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          enrollmentId: enrollment._id,
        }),
      });

      const data = await res.json();
      console.log("PAYMENT INIT RESPONSE:", data);

      if (!res.ok || !data.paymentUrl) {
        throw new Error(data.message || "Payment URL not received");
      }

      // Open SSLCommerz in a new tab
      const paymentWindow = window.open(
        data.paymentUrl,
        "_blank",
        "width=800,height=600"
      );

      if (paymentWindow) {
        // Close modal after initiating payment
        setShowPaymentModal(false);
        
        // Check payment status every 5 seconds
        const checkInterval = setInterval(async () => {
          try {
            await fetchEnrollment();
            if (enrollment?.paymentStatus === "completed") {
              clearInterval(checkInterval);
              setSuccessMessage("Payment completed successfully!");
            }
          } catch (err) {
            console.error("Payment status check error:", err);
          }
        }, 5000);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to initiate payment");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // DOWNLOAD INVOICE
  // =========================
  const handleDownloadInvoice = async () => {
    if (!enrollment?._id) {
      setError("No enrollment found");
      return;
    }

    if (enrollment.paymentStatus !== "completed") {
      setError("Invoice is only available for completed payments");
      return;
    }

    try {
      setInvoiceLoading(true);
      setError("");

      // Method 1: Direct download using fetch
      const response = await fetch(
        `http://localhost:5000/api/payments/invoice/${enrollment._id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/pdf",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to download invoice");
      }

      // Create blob and download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice-${enrollment._id}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Invoice download error:", err);
      setError(err.message || "Failed to download invoice");
    } finally {
      setInvoiceLoading(false);
    }
  };

  // =========================
  // REFRESH ENROLLMENT STATUS
  // =========================
  const handleRefreshStatus = async () => {
    try {
      setRefreshing(true);
      await fetchEnrollment();
      setSuccessMessage("Status refreshed!");
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (err) {
      console.error("Refresh error:", err);
      setError("Failed to refresh status");
    } finally {
      setRefreshing(false);
    }
  };

  // =========================
  // RENDER LOADING
  // =========================
  if (!course) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-green-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">{successMessage}</p>
            </div>
            <div className="ml-auto pl-3">
              <button
                onClick={() => setSuccessMessage("")}
                className="text-green-500 hover:text-green-700"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
            <div className="ml-auto pl-3">
              <button
                onClick={() => setError("")}
                className="text-red-500 hover:text-red-700"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Course Content */}
        <div className="lg:col-span-2">
          {/* Course Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {course.title}
            </h1>
            <p className="text-gray-600 text-lg mb-6">{course.description}</p>

            {course.instructor && (
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">
                    {course.instructor.name?.[0] || "I"}
                  </span>
                </div>
                <div>
                  <p className="font-medium">
                    {course.instructor.name || "Instructor"}
                  </p>
                  <p className="text-sm text-gray-500">Course Instructor</p>
                </div>
              </div>
            )}
          </div>

          {/* Course Content */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Course Content</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              {course.curriculum && course.curriculum.length > 0 ? (
                <div className="space-y-4">
                  {course.curriculum.map((module, index) => (
                    <div key={index} className="border-b pb-4 last:border-0">
                      <h3 className="font-semibold text-lg mb-2">
                        Module {index + 1}: {module.title}
                      </h3>
                      {module.lessons && module.lessons.length > 0 && (
                        <ul className="space-y-2 ml-4">
                          {module.lessons.map((lesson, lessonIndex) => (
                            <li key={lessonIndex} className="flex items-center">
                              <svg
                                className="w-4 h-4 text-gray-400 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              <span className="text-gray-600">{lesson.title}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">Course curriculum coming soon...</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Enrollment Card */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg sticky top-6">
            <h3 className="text-xl font-bold mb-4">Enroll in this Course</h3>

            <div className="space-y-4">
              {/* Price Display */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-600">Course Fee</span>
                {course.price && course.price > 0 ? (
                  <div className="text-right">
                    <span className="text-2xl font-bold">${course.price}</span>
                    {course.originalPrice &&
                      course.originalPrice > course.price && (
                        <span className="text-sm text-gray-400 line-through ml-2">
                          ${course.originalPrice}
                        </span>
                      )}
                  </div>
                ) : (
                  <span className="text-2xl font-bold text-green-600">Free</span>
                )}
              </div>

              {/* Enrollment Status */}
              {!enrollment ? (
                <div className="text-center">
                  <p className="text-gray-600 mb-4">
                    Access all course materials and start learning today
                  </p>
                  <button
                    onClick={handleEnroll}
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg
                          className="animate-spin h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      "Enroll Now"
                    )}
                  </button>
                </div>
              ) : enrollment.paymentStatus !== "completed" ? (
                <div className="space-y-4">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                      <span className="font-medium text-yellow-800">
                        Payment Pending
                      </span>
                    </div>
                    <p className="text-sm text-yellow-700">
                      Complete your payment to access the course
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowPaymentModal(true)}
                      className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold transition-colors duration-200"
                    >
                      💳 Pay Now
                    </button>
                    <button
                      onClick={handleRefreshStatus}
                      disabled={refreshing}
                      className="px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg font-semibold transition-colors duration-200 disabled:opacity-50"
                    >
                      {refreshing ? (
                        <svg
                          className="animate-spin h-5 w-5"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      ) : (
                        "🔄"
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="font-medium text-green-800">
                        Payment Completed
                      </span>
                    </div>
                    {enrollment.paymentDate && (
                      <p className="text-sm text-green-700">
                        Paid on{" "}
                        {new Date(enrollment.paymentDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={() => navigate(`/enrollments/${enrollment._id}`)}
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-colors duration-200"
                    >
                      ▶ Start Learning
                    </button>

                    <button
                      onClick={handleDownloadInvoice}
                      disabled={invoiceLoading}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                      {invoiceLoading ? (
                        <>
                          <svg
                            className="animate-spin h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Generating Invoice...
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            ></path>
                          </svg>
                          Download Invoice
                        </>
                      )}
                    </button>
                  </div>

                  {enrollment.paymentId && (
                    <div className="pt-4 border-t">
                      <p className="text-sm text-gray-600 mb-2">
                        Transaction Details:
                      </p>
                      <div className="bg-gray-50 p-3 rounded text-sm">
                        <p className="mb-1">
                          <span className="font-medium">Payment ID:</span>{" "}
                          {enrollment.paymentId}
                        </p>
                        {enrollment.amount && (
                          <p>
                            <span className="font-medium">Amount:</span> $
                            {enrollment.amount}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Course Features */}
              <div className="pt-6 border-t">
                <h4 className="font-semibold mb-3">What's included:</h4>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-green-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm">Lifetime access</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-green-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm">Certificate of completion</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-green-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm">Q&A support</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================= PAYMENT MODAL ========================= */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-2xl w-full max-w-md">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-3">Complete Your Payment</h2>

              <p className="text-gray-600 mb-6">
                You will be redirected to SSLCommerz secure payment gateway to
                complete your payment.
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div className="text-left">
                    <p className="text-sm font-medium text-blue-800">
                      Important Note
                    </p>
                    <p className="text-sm text-blue-700 mt-1">
                      After payment, you will be redirected back to this page.
                      If you face any issues, click the "Refresh Status" button.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={handlePayment}
                  disabled={loading}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Redirecting to Payment...
                    </span>
                  ) : (
                    "💳 Proceed to Payment"
                  )}
                </button>

                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg font-semibold transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetails;