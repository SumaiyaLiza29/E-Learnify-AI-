import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="container mx-auto px-4 py-20 text-center text-white">
        <h1 className="text-5xl font-bold mb-6">
          Welcome to E-learnify
        </h1>
        <p className="text-xl mb-8">
          AI-powered online learning platform
        </p>
        <div className="space-x-4">
          <Link
            to="/courses"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-blue-50 inline-block"
          >
            Browse Courses
          </Link>
          <Link
            to="/register"
            className="bg-green-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-600 inline-block"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;