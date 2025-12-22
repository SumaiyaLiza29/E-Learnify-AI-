import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { authAPI } from "../services/api";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const item = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authAPI.register(formData);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#0B0F1A] overflow-hidden px-4">
      
      {/* Background glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-[320px] h-[320px] bg-indigo-500/25 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[320px] h-[320px] bg-blue-500/25 rounded-full blur-3xl" />
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="w-full max-w-md"
      >
        <motion.div
          variants={item}
          className="bg-white/8 backdrop-blur-xl border border-white/12 rounded-2xl shadow-2xl p-8"
        >
          <motion.h2
            variants={item}
            className="text-3xl font-bold text-slate-100 text-center mb-2"
          >
            Create Your Account
          </motion.h2>

          <motion.p
            variants={item}
            className="text-center text-slate-400 mb-8"
          >
            Join E-learnify and start learning smarter
          </motion.p>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border border-red-500/25 text-red-300 px-4 py-3 rounded-lg mb-6 text-sm"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div variants={item}>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Your full name"
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/15 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </motion.div>

            <motion.div variants={item}>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/15 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </motion.div>

            <motion.div variants={item}>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                placeholder="Minimum 6 characters"
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/15 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </motion.div>
             
            <motion.div variants={item}>
  <label className="block text-sm font-medium text-slate-300 mb-2">
    I am a
  </label>

  <select
    name="role"
    value={formData.role}
    onChange={handleChange}
    className="
      w-full px-4 py-3 rounded-lg
      bg-white/5 border border-white/15
      text-slate-100
      focus:outline-none focus:ring-2 focus:ring-indigo-500
      transition
    "
  >
    <option
      value="student"
      className="bg-[#0B0F1A] text-slate-100"
    >
      Student
    </option>
    <option
      value="instructor"
      className="bg-[#0B0F1A] text-slate-100"
    >
      Instructor
    </option>
  </select>
</motion.div>


            <motion.button
              variants={item}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-500 to-blue-600 hover:opacity-90 transition shadow-lg disabled:opacity-60"
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </motion.button>
          </form>

          <motion.p
            variants={item}
            className="text-center text-slate-400 mt-6 text-sm"
          >
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-indigo-400 hover:text-indigo-300 transition underline-offset-4 hover:underline"
            >
              Login here
            </Link>
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Register;
