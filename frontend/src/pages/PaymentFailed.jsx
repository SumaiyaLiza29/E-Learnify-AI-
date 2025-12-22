import React from 'react';
import { Link } from 'react-router-dom';

function PaymentFailed() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-gray-800 rounded-3xl shadow-2xl p-8 text-center border border-gray-700">
        <div className="mb-6">
          <div className="mx-auto w-20 h-20 bg-red-700/20 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-white mb-4">
          Payment Failed
        </h2>

        <p className="text-gray-300 mb-8">
          Unfortunately, your payment could not be processed.
          Please try again or contact support if the problem persists.
        </p>

        <div className="space-y-3">
          <Link
            to="/courses"
            className="block w-full bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition"
          >
            Try Again
          </Link>

          <Link
            to="/dashboard"
            className="block w-full bg-gray-700 text-gray-300 py-3 rounded-xl font-semibold hover:bg-gray-600 transition"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PaymentFailed;
