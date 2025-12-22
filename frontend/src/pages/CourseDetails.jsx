import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { courseAPI, enrollmentAPI, paymentAPI } from '../services/api';

function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      const response = await courseAPI.getCourseById(id);
      setCourse(response.data);
    } catch (error) {
      console.error('Error fetching course:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!user.id) {
      navigate('/login');
      return;
    }

    setEnrolling(true);

    try {
      const enrollmentResponse = await enrollmentAPI.createEnrollment(id);
      const enrollmentId = enrollmentResponse.data.enrollmentId;

      const paymentResponse = await paymentAPI.initiatePayment(enrollmentId);
      window.location.href = paymentResponse.data.paymentUrl;
    } catch (error) {
      console.error('Enrollment error:', error);
      alert(error.response?.data?.message || 'Failed to enroll. Please try again.');
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
        <div className="text-xl animate-pulse">Loading course details...</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-12 text-center text-white">
        <p className="text-xl">Course not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 bg-gray-900 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Course Header */}
        <div className="h-64 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl mb-8 shadow-lg"></div>

        <div className="bg-gray-800 rounded-2xl shadow-xl p-8 text-white">
          <h1 className="text-4xl font-bold mb-4">{course.title}</h1>

          <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
            <div className="space-y-1">
              <p className="text-gray-300">Instructor: {course.instructorName}</p>
              <p className="text-gray-300">Category: {course.category}</p>
            </div>
            <div className="text-3xl font-bold text-green-400">
              ৳{course.price}
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-3 text-white">About this course</h2>
            <p className="text-gray-300 whitespace-pre-line">{course.description}</p>
          </div>

          {course.duration && (
            <div className="mb-6 text-gray-400">
              ⏱️ Duration: {course.duration} hours
            </div>
          )}

          {course.tags && course.tags.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-2">
              {course.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-blue-700 text-blue-100 px-3 py-1 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <button
            onClick={handleEnroll}
            disabled={enrolling}
            className="w-full bg-green-600 text-white py-4 rounded-xl text-xl font-bold hover:bg-green-700 disabled:bg-green-300 transition"
          >
            {enrolling ? 'Processing...' : 'Enroll Now'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CourseDetails;
