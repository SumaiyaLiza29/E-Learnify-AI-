import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';

function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const enrollmentId = searchParams.get('enrollment');

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Payment Successful!
        </h2>

        <p className="text-gray-600 mb-8">
          Congratulations! You have successfully enrolled in the course.
          Your learning journey starts now!
        </p>

        <div className="space-y-3">
          <Link
            to="/my-courses"
            className="block w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700"
          >
            Go to My Courses
          </Link>

          <Link
            to="/courses"
            className="block w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300"
          >
            Browse More Courses
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccess;