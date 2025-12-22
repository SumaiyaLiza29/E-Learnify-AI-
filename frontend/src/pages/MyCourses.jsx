import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const MyCourses = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingInvoice, setDownloadingInvoice] = useState({});

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

  const downloadInvoice = async (enrollmentId) => {
    if (!token) return;
    
    try {
      setDownloadingInvoice(prev => ({ ...prev, [enrollmentId]: true }));
      
      // First, check if invoice exists
      const invoiceResponse = await axios.get(
        `http://localhost:5000/api/invoices/${enrollmentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (invoiceResponse.data.success) {
        // Download the PDF invoice
        const response = await axios.get(
          `http://localhost:5000/api/invoices/${enrollmentId}/download`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            responseType: 'blob' // Important for file download
          }
        );

        // Create a blob and trigger download
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `invoice-${invoiceResponse.data.invoice.invoiceNumber}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        
        // Clean up the URL object
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error downloading invoice:', error);
      
      if (error.response?.status === 404) {
        alert('Invoice not found for this enrollment. Please contact support.');
      } else {
        alert('Failed to download invoice. Please try again later.');
      }
    } finally {
      setDownloadingInvoice(prev => ({ ...prev, [enrollmentId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500 text-lg">Loading your courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">
        🎓 My Courses
      </h2>

      {enrollments.length === 0 ? (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-dashed border-blue-200 rounded-2xl p-10 text-center">
          <div className="text-6xl mb-4">📚</div>
          <p className="text-xl font-medium text-gray-700 mb-2">
            You are not enrolled in any courses yet
          </p>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Explore our wide range of courses and start your learning journey today 🚀
          </p>
          <button
            onClick={() => navigate("/courses")}
            className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow-lg hover:shadow-xl"
          >
            Browse Courses
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrollments.map((e) => (
            <div
              key={e._id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
            >
              {/* Course Header */}
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
                  {e.courseTitle}
                </h3>
                
                {/* Payment Status */}
                <div className="flex items-center gap-2 mb-4">
                  <span
                    className={`inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full ${
                      e.paymentStatus === "completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full mr-1.5 ${
                      e.paymentStatus === "completed" ? "bg-green-500" : "bg-yellow-500"
                    }`}></span>
                    {e.paymentStatus === "completed" ? "Paid" : "Payment Pending"}
                  </span>
                  
                  {e.paymentStatus === "completed" && (
                    <span className="text-xs text-gray-500">
                      • Enrolled on {new Date(e.enrolledAt || e.createdAt).toLocaleDateString()}
                    </span>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span className="font-medium">Learning Progress</span>
                    <span className="font-bold text-blue-600">{e.progress || 0}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div
                      className="h-2.5 rounded-full bg-gradient-to-r from-blue-500 to-blue-600"
                      style={{ width: `${e.progress || 0}%` }}
                    ></div>
                  </div>
                </div>

                {/* Course Info */}
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{e.duration || "Self-paced"}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{e.completedLessons || 0}/{e.totalLessons || 0} lessons</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-6 pt-4 space-y-3">
                <button
                  onClick={() => navigate(`/enrollments/${e._id}`)}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold hover:from-blue-700 hover:to-blue-800 transition shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 10v4a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {e.progress === 100 ? "View Certificate" : "Continue Learning"}
                </button>

                {/* Invoice Download Button (only for paid courses) */}
                {e.paymentStatus === "completed" && (
                  <button
                    onClick={() => downloadInvoice(e._id)}
                    disabled={downloadingInvoice[e._id]}
                    className="w-full py-2.5 rounded-xl border-2 border-gray-200 text-gray-700 font-medium hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {downloadingInvoice[e._id] ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        Downloading...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Download Invoice
                      </>
                    )}
                  </button>
                )}

                {/* Additional info for pending payments */}
                {e.paymentStatus !== "completed" && (
                  <div className="text-center">
                    <p className="text-sm text-gray-500">
                      Complete payment to access course content
                    </p>
                    <button
                      onClick={() => navigate(`/enrollments/${e._id}/payment`)}
                      className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                      Complete Payment →
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats Bar */}
      {enrollments.length > 0 && (
        <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
          <div className="flex flex-wrap items-center justify-between">
            <div className="text-center px-4 py-2">
              <p className="text-2xl font-bold text-blue-600">{enrollments.length}</p>
              <p className="text-sm text-gray-600">Total Courses</p>
            </div>
            <div className="text-center px-4 py-2">
              <p className="text-2xl font-bold text-green-600">
                {enrollments.filter(e => e.paymentStatus === "completed").length}
              </p>
              <p className="text-sm text-gray-600">Paid Courses</p>
            </div>
            <div className="text-center px-4 py-2">
              <p className="text-2xl font-bold text-purple-600">
                {Math.round(enrollments.reduce((acc, e) => acc + (e.progress || 0), 0) / enrollments.length)}%
              </p>
              <p className="text-sm text-gray-600">Avg Progress</p>
            </div>
            <div className="text-center px-4 py-2">
              <p className="text-2xl font-bold text-orange-600">
                {enrollments.filter(e => e.progress === 100).length}
              </p>
              <p className="text-sm text-gray-600">Completed</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCourses;