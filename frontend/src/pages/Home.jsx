import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Sparkles, 
  Brain, 
  Target, 
  BarChart3, 
  Award, 
  Users, 
  Clock,
  Zap,
  CheckCircle,
  Star,
  Rocket,
  ChevronRight
} from "lucide-react";

/* ================= ANIMATIONS ================= */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6 } }
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const float = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

function Home() {
  return (
    <div className="relative overflow-hidden bg-[#0B0F1A] text-white min-h-screen">

      {/* ================= ANIMATED BACKGROUND ================= */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {/* Gradient Orbs */}
        <motion.div
          animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{ x: [0, -80, 0], y: [0, -30, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-gradient-to-r from-sky-600/20 to-cyan-600/20 rounded-full blur-[100px]"
        />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        
        {/* Noise Texture */}
        <div className="absolute inset-0 bg-noise opacity-10" />
      </div>

  

      {/* ================= HERO ================= */}
      <section className="relative pt-48 pb-36 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="max-w-4xl"
          >
            {/* Badge */}
            <motion.div
              variants={fadeUp}
              className="inline-flex items-center gap-2 mb-8 rounded-full border border-white/15 bg-gradient-to-r from-indigo-500/20 to-sky-500/20 px-5 py-2.5 backdrop-blur"
            >
              <Rocket className="w-4 h-4" />
              <span className="text-sm font-medium bg-gradient-to-r from-indigo-300 to-sky-300 bg-clip-text text-transparent">
                Next-Gen AI Learning Platform
              </span>
              <div className="h-4 w-px bg-white/20" />
              <span className="text-xs text-slate-300">Just Launched</span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              variants={fadeUp}
              className="text-5xl sm:text-6xl md:text-7xl font-bold leading-tight mb-8"
            >
              Learn <span className="relative">
                <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-sky-400 bg-clip-text text-transparent">
                  Smarter
                </span>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute -top-2 -right-2"
                >
                  <Sparkles className="w-6 h-6 text-yellow-400" />
                </motion.div>
              </span>
              <br />
              Build Skills with{" "}
              <span className="bg-gradient-to-r from-indigo-400 to-sky-400 bg-clip-text text-transparent">
                AI
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={fadeUp}
              className="max-w-2xl text-xl text-slate-300 mb-12 leading-relaxed"
            >
              The world's first AI-powered learning platform that adapts to your 
              unique learning style, pace, and career goals. Get personalized 
              courses, real-time feedback, and industry-recognized certificates.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={fadeUp}
              className="flex flex-col sm:flex-row gap-6 items-center"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/courses"
                  className="group relative inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-indigo-500 to-sky-500 px-10 py-4 text-base font-semibold shadow-2xl shadow-indigo-500/30 transition-all duration-300"
                >
                  <span>Start Learning Free</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                </Link>
              </motion.div>
              
              <Link
                to="/demo"
                className="group inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-8 py-4 text-sm font-semibold backdrop-blur hover:bg-white/10 transition-all"
              >
                <div className="relative">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-ping absolute" />
                  <div className="w-3 h-3 bg-red-500 rounded-full relative" />
                </div>
                <span>Watch Demo</span>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={fadeUp}
              className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
            >
              {[
                { icon: Users, value: "50K+", label: "Active Learners", color: "text-sky-400" },
                { icon: Award, value: "1K+", label: "Courses", color: "text-purple-400" },
                { icon: CheckCircle, value: "98%", label: "Satisfaction", color: "text-emerald-400" },
                { icon: Zap, value: "10x", label: "Faster Learning", color: "text-amber-400" },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                    <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                  </div>
                  <p className="text-sm text-slate-400">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Floating Elements */}
          <motion.div
            variants={float}
            animate="animate"
            className="absolute top-40 right-20 hidden xl:block"
          >
            <div className="relative">
              <div className="w-72 h-72 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-2xl border border-white/10 backdrop-blur p-6">
                <Brain className="w-12 h-12 text-indigo-400 mb-4" />
                <h4 className="font-semibold mb-2">AI Mentor</h4>
                <p className="text-sm text-slate-300">Personalized guidance 24/7</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-sky-500/10 px-4 py-1.5 mb-4">
              <Zap className="w-4 h-4 text-sky-400" />
              <span className="text-sm font-medium text-sky-300">Why Choose Us</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Transform Your Learning <span className="text-indigo-400">Experience</span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Powered by cutting-edge AI technology designed to accelerate your growth
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Brain,
                title: "Adaptive AI",
                description: "Content that evolves with your progress",
                gradient: "from-purple-500/20 to-pink-500/20",
                color: "text-purple-400"
              },
              {
                icon: Target,
                title: "Goal Tracking",
                description: "Personalized roadmap to your objectives",
                gradient: "from-sky-500/20 to-cyan-500/20",
                color: "text-sky-400"
              },
              {
                icon: BarChart3,
                title: "Smart Analytics",
                description: "Deep insights into your learning patterns",
                gradient: "from-emerald-500/20 to-green-500/20",
                color: "text-emerald-400"
              },
              {
                icon: Clock,
                title: "Time Optimization",
                description: "Learn more in less time with AI scheduling",
                gradient: "from-amber-500/20 to-orange-500/20",
                color: "text-amber-400"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -10, scale: 1.02 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative rounded-2xl bg-gradient-to-br ${feature.gradient} border border-white/10 p-8 backdrop-blur`}
              >
                <div className="absolute top-6 right-6">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                    <feature.icon className={`w-5 h-5 ${feature.color}`} />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3 mt-12">{feature.title}</h3>
                <p className="text-slate-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= AI SHOWCASE ================= */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 px-4 py-1.5 mb-6">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span className="text-sm font-medium text-indigo-300">AI-Powered</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Your Personal <span className="text-indigo-400">AI Learning</span> Assistant
              </h2>
              <p className="text-lg text-slate-300 mb-8">
                Experience learning that adapts to you. Our AI analyzes your strengths, 
                weaknesses, and learning style to create a perfectly tailored educational journey.
              </p>
              
              <div className="space-y-6">
                {[
                  "Real-time progress tracking with predictive analytics",
                  "Personalized course recommendations based on career goals",
                  "Automated difficulty adjustment for optimal challenge",
                  "Instant feedback and explanations for every concept"
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300">{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Animated Dashboard Preview */}
              <div className="relative rounded-2xl border border-white/20 bg-gradient-to-br from-gray-900 to-black p-8 shadow-2xl">
                <div className="flex gap-2 mb-6">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                </div>
                
                <div className="space-y-6">
                  <div className="h-4 bg-gradient-to-r from-indigo-500/30 to-sky-500/30 rounded-full w-3/4" />
                  <div className="h-4 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-full w-2/3" />
                  <div className="h-4 bg-gradient-to-r from-emerald-500/30 to-green-500/30 rounded-full w-4/5" />
                </div>

                {/* Floating Elements */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-6 -right-6 bg-gradient-to-r from-indigo-500 to-purple-500 p-4 rounded-2xl shadow-xl"
                >
                  <Brain className="w-8 h-8" />
                </motion.div>
                
                <motion.div
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
                  className="absolute -bottom-6 -left-6 bg-gradient-to-r from-sky-500 to-cyan-500 p-4 rounded-2xl shadow-xl"
                >
                  <Zap className="w-8 h-8" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-4 py-1.5 mb-4">
              <Star className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-medium text-amber-300">Testimonials</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Loved by <span className="text-amber-400">Thousands</span> of Learners
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Alex Chen",
                role: "Software Engineer",
                company: "Google",
                content: "E-Learnify's AI recommendations helped me master React in half the time. The personalized path was exactly what I needed.",
                rating: 5,
                imageColor: "bg-gradient-to-br from-sky-500 to-cyan-500"
              },
              {
                name: "Maria Garcia",
                role: "Data Scientist",
                company: "Meta",
                content: "The adaptive learning system is revolutionary. It identified my weak spots and created custom exercises to strengthen them.",
                rating: 5,
                imageColor: "bg-gradient-to-br from-purple-500 to-pink-500"
              },
              {
                name: "David Park",
                role: "Product Manager",
                company: "Microsoft",
                content: "Certificates from E-Learnify are recognized industry-wide. Landed my dream job within 3 months of completing the AI/ML track.",
                rating: 5,
                imageColor: "bg-gradient-to-br from-emerald-500 to-green-500"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -8 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative rounded-2xl bg-white/5 border border-white/10 p-8 backdrop-blur"
              >
                <div className="absolute -top-4 left-8">
                  <div className={`w-12 h-12 rounded-full ${testimonial.imageColor} flex items-center justify-center`}>
                    <span className="text-white font-bold">{testimonial.name.charAt(0)}</span>
                  </div>
                </div>
                
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                
                <p className="text-slate-300 mb-6">"{testimonial.content}"</p>
                
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-slate-400">
                    {testimonial.role} • {testimonial.company}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Glow Effect */}
            <div className="absolute inset-0 -z-10">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-indigo-600/30 to-sky-600/30 rounded-full blur-[120px]" />
            </div>
            
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500/20 to-sky-500/20 px-6 py-2.5 mb-8">
              <Rocket className="w-5 h-5 text-sky-400" />
              <span className="text-sm font-medium text-sky-300">Limited Time Offer</span>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-bold mb-8">
              Start Your <span className="bg-gradient-to-r from-indigo-400 to-sky-400 bg-clip-text text-transparent">
                AI-Powered
              </span> Learning Journey
            </h2>
            
            <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto">
              Join 50,000+ learners transforming their careers with personalized AI education.
              Get your first month free.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <Link
                  to="/register"
                  className="group relative inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 px-12 py-4 text-base font-semibold shadow-2xl shadow-indigo-500/40 transition-all duration-300"
                >
                  <span>Get Started Free</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                </Link>
              </motion.div>
              
              <Link
                to="/enterprise"
                className="text-sm font-medium text-slate-300 hover:text-white transition flex items-center gap-2"
              >
                <span>For Teams & Enterprise</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            
            <p className="mt-6 text-sm text-slate-400">
              No credit card required • 7-day free trial • Cancel anytime
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default Home;