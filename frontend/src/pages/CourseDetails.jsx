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
      // Step 1: Create enrollment
      const enrollmentResponse = await enrollmentAPI.createEnrollment(id);
      const enrollmentId = enrollmentResponse.data.enrollmentId;

      // Step 2: Initiate payment
      const paymentResponse = await paymentAPI.initiatePayment(enrollmentId);
      
      // Step 3: Redirect to payment gateway
      window.location.href = paymentResponse.data.paymentUrl;

    } catch (error) {
      console.error('Enrollment error:', error);
      alert(error.response?.data?.message || 'Failed to enroll. Please try again.');
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading course details...</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-xl">Course not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Course Header */}
        <div className="h-64 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg mb-8"></div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
          
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-gray-600">Instructor: {course.instructorName}</p>
              <p className="text-gray-600">Category: {course.category}</p>
            </div>
            <div className="text-3xl font-bold text-blue-600">
              ৳{course.price}
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-3">About this course</h2>
            <p className="text-gray-700 whitespace-pre-line">{course.description}</p>
          </div>

          {course.duration && (
            <div className="mb-6">
              <p className="text-gray-600">⏱️ Duration: {course.duration} hours</p>
            </div>
          )}

          {course.tags && course.tags.length > 0 && (
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                {course.tags.map((tag, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleEnroll}
            disabled={enrolling}
            className="w-full bg-green-600 text-white py-4 rounded-lg text-xl font-bold hover:bg-green-700 disabled:bg-green-300"
          >
            {enrolling ? 'Processing...' : 'Enroll Now'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CourseDetails;