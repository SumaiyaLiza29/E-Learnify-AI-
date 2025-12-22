import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0B0F1A] text-white">
      
      {/* Animated Gradient Orbs */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-purple-600/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-500/30 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-32 flex flex-col items-center justify-center text-center">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-4xl"
        >
          <motion.span
            variants={item}
            className="inline-block mb-6 px-4 py-1 text-sm font-medium rounded-full bg-white/10 backdrop-blur border border-white/10"
          >
            🚀 AI-Powered Learning Platform
          </motion.span>

          <motion.h1
            variants={item}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6"
          >
            Learn Smarter with{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              E-learnify
            </span>
          </motion.h1>

          <motion.p
            variants={item}
            className="text-lg sm:text-xl text-gray-300 mb-10"
          >
            Personalized, AI-driven courses designed to accelerate your skills,
            boost your confidence, and shape your future.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={item}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/courses"
              className="relative inline-flex items-center justify-center px-8 py-3 rounded-xl font-semibold bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90 transition-all duration-300 shadow-lg"
            >
              Browse Courses
            </Link>

            <Link
              to="/register"
              className="inline-flex items-center justify-center px-8 py-3 rounded-xl font-semibold bg-white/10 backdrop-blur border border-white/20 hover:bg-white/20 transition-all duration-300"
            >
              Get Started Free
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0B0F1A] to-transparent" />
    </div>
  );
}

export default Home;
