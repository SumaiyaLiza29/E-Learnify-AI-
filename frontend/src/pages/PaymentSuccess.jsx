import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';

function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const enrollmentId = searchParams.get('enrollment');

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-gray-800 rounded-3xl shadow-2xl p-8 text-center border border-gray-700">
        <div className="mb-6">
          <div className="mx-auto w-20 h-20 bg-green-700/20 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-white mb-4">
          Payment Successful!
        </h2>

        <p className="text-gray-300 mb-8">
          Congratulations! You have successfully enrolled in the course.
          Your learning journey starts now!
        </p>

        <div className="space-y-3">
          <Link
            to="/my-courses"
            className="block w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition"
          >
            Go to My Courses
          </Link>

          <Link
            to="/courses"
            className="block w-full bg-gray-700 text-gray-300 py-3 rounded-xl font-semibold hover:bg-gray-600 transition"
          >
            Browse More Courses
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccess;
