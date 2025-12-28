import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  BookOpen, 
  Award, 
  User, 
  BarChart3, 
  Clock, 
  TrendingUp,
  Calendar,
  Target,
  ChevronRight,
  Sparkles,
  Star,
  CheckCircle,
  PlayCircle,
  Download,
  Settings
} from "lucide-react";

function StudentDashboard() {
  const [stats, setStats] = useState({
    enrolledCourses: 5,
    completedCourses: 2,
    certificates: 3,
    learningHours: 42,
    streakDays: 7,
    avgScore: 87
  });

  const [recentCourses, setRecentCourses] = useState([
    { id: 1, title: "React Masterclass", progress: 75, instructor: "Alex Johnson", lastAccessed: "2 hours ago" },
    { id: 2, title: "Advanced JavaScript", progress: 30, instructor: "Sarah Lee", lastAccessed: "Yesterday" },
    { id: 3, title: "UI/UX Design", progress: 90, instructor: "Mike Chen", lastAccessed: "3 days ago" },
  ]);

  const [upcomingDeadlines, setUpcomingDeadlines] = useState([
    { id: 1, title: "React Project Submission", course: "React Masterclass", dueDate: "Tomorrow" },
    { id: 2, title: "JavaScript Quiz", course: "Advanced JavaScript", dueDate: "In 3 days" },
  ]);

  // Simulate streak animation
  const [streakAnimation, setStreakAnimation] = useState(false);

  useEffect(() => {
    // Trigger streak animation on mount
    setStreakAnimation(true);
    const timer = setTimeout(() => setStreakAnimation(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-900/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-900/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Sparkles className="text-yellow-400" size={24} />
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                  Welcome Back, Student!
                </h1>
              </div>
              <p className="text-gray-400 text-lg">
                Continue your learning journey and track your progress
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className={`relative ${streakAnimation ? 'animate-pulse' : ''}`}>
                <div className="px-4 py-2 bg-gradient-to-r from-yellow-900/30 to-orange-900/30 rounded-xl border border-yellow-700/50">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                    <span className="font-bold text-yellow-300">{stats.streakDays} Day Streak</span>
                  </div>
                </div>
                {streakAnimation && (
                  <div className="absolute -top-2 -right-2">
                    <Sparkles className="text-yellow-400 animate-spin" size={16} />
                  </div>
                )}
              </div>
              <Link
                to="/settings"
                className="p-3 bg-gray-800 hover:bg-gray-700 rounded-xl border border-gray-700 transition"
              >
                <Settings size={20} />
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-10">
          {[
            { 
              icon: BookOpen, 
              value: stats.enrolledCourses, 
              label: "Enrolled", 
              color: "blue",
              change: "+2"
            },
            { 
              icon: CheckCircle, 
              value: stats.completedCourses, 
              label: "Completed", 
              color: "green",
              change: "+1"
            },
            { 
              icon: Award, 
              value: stats.certificates, 
              label: "Certificates", 
              color: "purple",
              change: "New"
            },
            { 
              icon: Clock, 
              value: `${stats.learningHours}h`, 
              label: "Learning", 
              color: "yellow",
              change: "+5h"
            },
            { 
              icon: BarChart3, 
              value: `${stats.avgScore}%`, 
              label: "Avg Score", 
              color: "pink",
              change: "+3%"
            },
            { 
              icon: TrendingUp, 
              value: "Level 4", 
              label: "Rank", 
              color: "cyan",
              change: "↑2"
            }
          ].map((stat, index) => (
            <div 
              key={index}
              className={`bg-gradient-to-br ${
                stat.color === 'blue' ? 'from-blue-900/30 to-blue-900/10' :
                stat.color === 'green' ? 'from-emerald-900/30 to-emerald-900/10' :
                stat.color === 'purple' ? 'from-purple-900/30 to-purple-900/10' :
                stat.color === 'yellow' ? 'from-yellow-900/30 to-yellow-900/10' :
                stat.color === 'pink' ? 'from-pink-900/30 to-pink-900/10' :
                'from-cyan-900/30 to-cyan-900/10'
              } backdrop-blur-sm rounded-2xl p-4 border border-gray-800 hover:border-gray-700 transition-all hover:scale-[1.02]`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg ${
                  stat.color === 'blue' ? 'bg-blue-900/50' :
                  stat.color === 'green' ? 'bg-emerald-900/50' :
                  stat.color === 'purple' ? 'bg-purple-900/50' :
                  stat.color === 'yellow' ? 'bg-yellow-900/50' :
                  stat.color === 'pink' ? 'bg-pink-900/50' :
                  'bg-cyan-900/50'
                }`}>
                  <stat.icon size={20} className={
                    stat.color === 'blue' ? 'text-blue-400' :
                    stat.color === 'green' ? 'text-emerald-400' :
                    stat.color === 'purple' ? 'text-purple-400' :
                    stat.color === 'yellow' ? 'text-yellow-400' :
                    stat.color === 'pink' ? 'text-pink-400' :
                    'text-cyan-400'
                  } />
                </div>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-800 text-gray-300">
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-sm text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Quick Actions */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Courses */}
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-3xl border border-gray-800 p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <BookOpen className="text-blue-400" />
                    Recent Courses
                  </h2>
                  <p className="text-gray-400">Continue where you left off</p>
                </div>
                <Link
                  to="/my-courses"
                  className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1"
                >
                  View All
                  <ChevronRight size={16} />
                </Link>
              </div>
              
              <div className="space-y-4">
                {recentCourses.map((course) => (
                  <div 
                    key={course.id}
                    className="group bg-gray-800/50 hover:bg-gray-800 rounded-2xl p-4 border border-gray-700 hover:border-blue-500/50 transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-white">{course.title}</h3>
                          <span className="text-xs text-gray-400">{course.lastAccessed}</span>
                        </div>
                        <p className="text-sm text-gray-400 mb-3">Instructor: {course.instructor}</p>
                        
                        {/* Progress Bar */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs text-gray-400">
                            <span>Progress</span>
                            <span>{course.progress}%</span>
                          </div>
                          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                              style={{ width: `${course.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      
                      <Link
                        to={`/course/${course.id}`}
                        className="ml-4 p-3 bg-blue-600 hover:bg-blue-700 rounded-xl transition opacity-0 group-hover:opacity-100"
                      >
                        <PlayCircle size={20} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Deadlines */}
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-3xl border border-gray-800 p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Calendar className="text-red-400" />
                    Upcoming Deadlines
                  </h2>
                  <p className="text-gray-400">Assignments and quizzes due soon</p>
                </div>
                <Link
                  to="/calendar"
                  className="text-red-400 hover:text-red-300 font-medium flex items-center gap-1"
                >
                  View Calendar
                  <ChevronRight size={16} />
                </Link>
              </div>
              
              <div className="space-y-4">
                {upcomingDeadlines.map((deadline) => (
                  <div 
                    key={deadline.id}
                    className="group bg-gray-800/50 hover:bg-gray-800 rounded-2xl p-4 border border-gray-700 hover:border-red-500/50 transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                          <span className="text-xs font-medium text-red-400 bg-red-900/30 px-2 py-1 rounded-full">
                            Due {deadline.dueDate}
                          </span>
                        </div>
                        <h3 className="font-semibold text-white mb-1">{deadline.title}</h3>
                        <p className="text-sm text-gray-400">Course: {deadline.course}</p>
                      </div>
                      
                      <button className="ml-4 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-xl text-sm font-medium transition">
                        Start Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Quick Access */}
          <div className="space-y-8">
            {/* Quick Access Cards */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Target className="text-green-400" />
                Quick Access
              </h3>
              
              <div className="grid grid-cols-1 gap-4">
                {/* My Courses Card */}
                <Link
                  to="/my-courses"
                  className="group bg-gradient-to-br from-blue-900/30 to-blue-900/10 rounded-2xl border border-blue-800/50 p-5 hover:border-blue-500 transition-all hover:scale-[1.02] backdrop-blur-sm"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-blue-900/50 rounded-xl">
                      <BookOpen className="text-blue-400" size={24} />
                    </div>
                    <ChevronRight className="text-blue-400 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all" size={20} />
                  </div>
                  <h4 className="font-bold text-white text-lg mb-2">My Courses</h4>
                  <p className="text-gray-400 text-sm">
                    View enrolled courses & track your progress
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-blue-300 text-sm font-medium">
                      {stats.enrolledCourses} Active
                    </span>
                    <span className="text-green-300 text-sm font-medium">
                      {stats.completedCourses} Completed
                    </span>
                  </div>
                </Link>

                {/* Certificates Card */}
                <Link
                  to="/certificates"
                  className="group bg-gradient-to-br from-purple-900/30 to-purple-900/10 rounded-2xl border border-purple-800/50 p-5 hover:border-purple-500 transition-all hover:scale-[1.02] backdrop-blur-sm"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-purple-900/50 rounded-xl">
                      <Award className="text-purple-400" size={24} />
                    </div>
                    <ChevronRight className="text-purple-400 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all" size={20} />
                  </div>
                  <h4 className="font-bold text-white text-lg mb-2">Certificates</h4>
                  <p className="text-gray-400 text-sm">
                    Download completed course certificates
                  </p>
                  <div className="mt-4 flex items-center gap-2">
                    <Download size={16} className="text-purple-400" />
                    <span className="text-purple-300 text-sm font-medium">
                      {stats.certificates} Available
                    </span>
                  </div>
                </Link>

                {/* Profile Card */}
                <Link
                  to="/profile"
                  className="group bg-gradient-to-br from-gray-800/50 to-gray-900/10 rounded-2xl border border-gray-700 p-5 hover:border-gray-500 transition-all hover:scale-[1.02] backdrop-blur-sm"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-gray-800 rounded-xl">
                      <User className="text-gray-400" size={24} />
                    </div>
                    <ChevronRight className="text-gray-400 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all" size={20} />
                  </div>
                  <h4 className="font-bold text-white text-lg mb-2">Profile</h4>
                  <p className="text-gray-400 text-sm">
                    Manage your personal information
                  </p>
                  <div className="mt-4 flex items-center gap-2">
                    <Star size={16} className="text-yellow-400" />
                    <span className="text-yellow-300 text-sm font-medium">
                      Level {stats.avgScore > 90 ? 'Expert' : stats.avgScore > 70 ? 'Advanced' : 'Intermediate'}
                    </span>
                  </div>
                </Link>
              </div>
            </div>

            {/* Achievement */}
            <div className="bg-gradient-to-br from-yellow-900/20 to-orange-900/10 rounded-2xl border border-yellow-800/30 p-5 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-yellow-900/50 rounded-lg">
                  <Sparkles className="text-yellow-400" size={20} />
                </div>
                <h4 className="font-bold text-white">Today's Achievement</h4>
              </div>
              <p className="text-gray-300 text-sm mb-4">
                You're on a {stats.streakDays}-day learning streak! Keep it up to unlock special rewards.
              </p>
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-400">
                  Next reward in {7 - stats.streakDays} days
                </div>
                <div className="text-yellow-400 font-bold">🔥</div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/10 rounded-2xl border border-gray-700 p-5 backdrop-blur-sm">
              <h4 className="font-bold text-white mb-4">Weekly Goal</h4>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm text-gray-400 mb-1">
                    <span>Learning Time</span>
                    <span>12/15 hours</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-500 to-cyan-500 rounded-full" style={{ width: '80%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm text-gray-400 mb-1">
                    <span>Course Progress</span>
                    <span>3/5 courses</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Recommendations */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <TrendingUp className="text-pink-400" />
                Recommended For You
              </h2>
              <p className="text-gray-400">Based on your learning history</p>
            </div>
            <Link
              to="/courses"
              className="text-pink-400 hover:text-pink-300 font-medium flex items-center gap-1"
            >
              Browse More
              <ChevronRight size={16} />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Advanced React Patterns", category: "Web Development", level: "Advanced", rating: 4.8 },
              { title: "Python for Data Science", category: "Data Science", level: "Intermediate", rating: 4.7 },
              { title: "DevOps Fundamentals", category: "DevOps", level: "Beginner", rating: 4.6 }
            ].map((course, index) => (
              <div
                key={index}
                className="group bg-gray-800/50 hover:bg-gray-800 rounded-2xl p-5 border border-gray-700 hover:border-pink-500/50 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-pink-400 bg-pink-900/30 px-3 py-1 rounded-full">
                    {course.category}
                  </span>
                  <div className="flex items-center gap-1 text-yellow-400">
                    <Star size={14} className="fill-current" />
                    <span className="text-sm font-medium">{course.rating}</span>
                  </div>
                </div>
                <h4 className="font-bold text-white mb-2">{course.title}</h4>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">{course.level}</span>
                  <button className="text-sm text-pink-400 hover:text-pink-300 font-medium">
                    Enroll Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;