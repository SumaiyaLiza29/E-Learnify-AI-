import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  BookOpen, 
  PlusCircle, 
  TrendingUp, 
  Users,
  DollarSign,
  BarChart3,
  MessageSquare,
  Calendar,
  Award,
  Star,
  Clock,
  Download,
  ChevronRight,
  Sparkles,
  Target,
  Settings,
  Video,
  FileText,
  CheckCircle,
  Zap
} from "lucide-react";

function InstructorDashboard() {
  const [stats, setStats] = useState({
    totalCourses: 5,
    totalStudents: 1247,
    totalEarnings: 45230,
    avgRating: 4.8,
    pendingReviews: 12,
    activeStudents: 347
  });

  const [recentCourses, setRecentCourses] = useState([
    { 
      id: 1, 
      title: "React Masterclass", 
      students: 425, 
      rating: 4.9,
      revenue: 15400,
      lastUpdate: "2 days ago",
      status: "published"
    },
    { 
      id: 2, 
      title: "Advanced JavaScript", 
      students: 312, 
      rating: 4.7,
      revenue: 11200,
      lastUpdate: "1 week ago",
      status: "published"
    },
    { 
      id: 3, 
      title: "UI/UX Design Pro", 
      students: 198, 
      rating: 4.8,
      revenue: 8500,
      lastUpdate: "3 days ago",
      status: "draft"
    },
  ]);

  const [recentStudents, setRecentStudents] = useState([
    { id: 1, name: "Alex Johnson", course: "React Masterclass", joined: "Today", progress: 45 },
    { id: 2, name: "Sarah Miller", course: "Advanced JavaScript", joined: "Yesterday", progress: 78 },
    { id: 3, name: "Mike Chen", course: "UI/UX Design Pro", joined: "2 days ago", progress: 32 },
  ]);

  const [performanceData, setPerformanceData] = useState([
    { month: 'Jan', earnings: 4200, students: 89 },
    { month: 'Feb', earnings: 5200, students: 112 },
    { month: 'Mar', earnings: 6100, students: 134 },
    { month: 'Apr', earnings: 7800, students: 156 },
    { month: 'May', earnings: 9200, students: 178 },
    { month: 'Jun', earnings: 10500, students: 203 },
  ]);

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
                <Sparkles className="text-purple-400" size={24} />
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                  Instructor Dashboard
                </h1>
              </div>
              <p className="text-gray-400 text-lg">
                Manage your courses, track earnings, and connect with students
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-xl border border-purple-500/50">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="font-bold text-green-300">Live Dashboard</span>
                </div>
              </div>
              <Link
                to="/instructor/settings"
                className="p-3 bg-gray-800 hover:bg-gray-700 rounded-xl border border-gray-700 transition"
              >
                <Settings size={20} />
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
          {[
            { 
              icon: BookOpen, 
              value: stats.totalCourses, 
              label: "Total Courses", 
              color: "blue",
              change: "+2"
            },
            { 
              icon: Users, 
              value: stats.totalStudents.toLocaleString(), 
              label: "Total Students", 
              color: "green",
              change: "+127"
            },
            { 
              icon: DollarSign, 
              value: `৳${stats.totalEarnings.toLocaleString()}`, 
              label: "Total Earnings", 
              color: "yellow",
              change: "+৳3,240"
            },
            { 
              icon: Star, 
              value: stats.avgRating, 
              label: "Avg Rating", 
              color: "purple",
              change: "+0.2"
            },
            { 
              icon: MessageSquare, 
              value: stats.pendingReviews, 
              label: "Pending Reviews", 
              color: "pink",
              change: "New"
            },
            { 
              icon: TrendingUp, 
              value: stats.activeStudents, 
              label: "Active Students", 
              color: "cyan",
              change: "+42"
            }
          ].map((stat, index) => (
            <div 
              key={index}
              className={`bg-gradient-to-br ${
                stat.color === 'blue' ? 'from-blue-900/30 to-blue-900/10' :
                stat.color === 'green' ? 'from-emerald-900/30 to-emerald-900/10' :
                stat.color === 'yellow' ? 'from-yellow-900/30 to-yellow-900/10' :
                stat.color === 'purple' ? 'from-purple-900/30 to-purple-900/10' :
                stat.color === 'pink' ? 'from-pink-900/30 to-pink-900/10' :
                'from-cyan-900/30 to-cyan-900/10'
              } backdrop-blur-sm rounded-2xl p-4 border border-gray-800 hover:border-gray-700 transition-all hover:scale-[1.02]`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg ${
                  stat.color === 'blue' ? 'bg-blue-900/50' :
                  stat.color === 'green' ? 'bg-emerald-900/50' :
                  stat.color === 'yellow' ? 'bg-yellow-900/50' :
                  stat.color === 'purple' ? 'bg-purple-900/50' :
                  stat.color === 'pink' ? 'bg-pink-900/50' :
                  'bg-cyan-900/50'
                }`}>
                  <stat.icon size={20} className={
                    stat.color === 'blue' ? 'text-blue-400' :
                    stat.color === 'green' ? 'text-emerald-400' :
                    stat.color === 'yellow' ? 'text-yellow-400' :
                    stat.color === 'purple' ? 'text-purple-400' :
                    stat.color === 'pink' ? 'text-pink-400' :
                    'text-cyan-400'
                  } />
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  stat.change.includes('+') 
                    ? 'bg-green-900/30 text-green-300' 
                    : stat.change === 'New'
                    ? 'bg-purple-900/30 text-purple-300'
                    : 'bg-gray-800 text-gray-300'
                }`}>
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
          {/* Left Column - Course Management */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Courses */}
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-3xl border border-gray-800 p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <BookOpen className="text-blue-400" />
                    Recent Courses
                  </h2>
                  <p className="text-gray-400">Manage and monitor your courses</p>
                </div>
                <Link
                  to="/instructor/courses"
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
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <h3 className="font-semibold text-white">{course.title}</h3>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              course.status === 'published' 
                                ? 'bg-green-900/30 text-green-300' 
                                : 'bg-yellow-900/30 text-yellow-300'
                            }`}>
                              {course.status}
                            </span>
                          </div>
                          <span className="text-xs text-gray-400">Updated {course.lastUpdate}</span>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4">
                          <div className="text-center">
                            <p className="text-2xl font-bold text-white">{course.students}</p>
                            <p className="text-xs text-gray-400">Students</p>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-1">
                              <Star size={14} className="text-yellow-400 fill-current" />
                              <p className="text-2xl font-bold text-white">{course.rating}</p>
                            </div>
                            <p className="text-xs text-gray-400">Rating</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-white">৳{course.revenue.toLocaleString()}</p>
                            <p className="text-xs text-gray-400">Revenue</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="ml-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition">
                        <Link
                          to={`/instructor/course/${course.id}`}
                          className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
                          title="Edit Course"
                        >
                          <Settings size={16} />
                        </Link>
                        <Link
                          to={`/instructor/analytics/${course.id}`}
                          className="p-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition"
                          title="View Analytics"
                        >
                          <BarChart3 size={16} />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Students */}
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-3xl border border-gray-800 p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Users className="text-green-400" />
                    Recent Students
                  </h2>
                  <p className="text-gray-400">Recently enrolled students</p>
                </div>
                <Link
                  to="/instructor/students"
                  className="text-green-400 hover:text-green-300 font-medium flex items-center gap-1"
                >
                  View All
                  <ChevronRight size={16} />
                </Link>
              </div>
              
              <div className="space-y-4">
                {recentStudents.map((student) => (
                  <div 
                    key={student.id}
                    className="group bg-gray-800/50 hover:bg-gray-800 rounded-2xl p-4 border border-gray-700 hover:border-green-500/50 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-900 to-emerald-900 rounded-xl flex items-center justify-center">
                          <Users className="text-green-400" size={20} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">{student.name}</h3>
                          <p className="text-sm text-gray-400">{student.course}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs text-gray-500">Joined {student.joined}</span>
                            <div className="flex items-center gap-1">
                              <div className="w-16 h-1 bg-gray-700 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                                  style={{ width: `${student.progress}%` }}
                                ></div>
                              </div>
                              <span className="text-xs text-gray-400">{student.progress}%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition opacity-0 group-hover:opacity-100">
                        Message
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Quick Actions */}
          <div className="space-y-8">
            {/* Quick Access Cards */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Zap className="text-yellow-400" />
                Quick Actions
              </h3>
              
              <div className="grid grid-cols-1 gap-4">
                {/* Create Course Card */}
                <Link
                  to="/instructor/create-course"
                  className="group bg-gradient-to-br from-blue-900/30 to-blue-900/10 rounded-2xl border border-blue-800/50 p-5 hover:border-blue-500 transition-all hover:scale-[1.02] backdrop-blur-sm"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-blue-900/50 rounded-xl">
                      <PlusCircle className="text-blue-400" size={24} />
                    </div>
                    <ChevronRight className="text-blue-400 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all" size={20} />
                  </div>
                  <h4 className="font-bold text-white text-lg mb-2">Create New Course</h4>
                  <p className="text-gray-400 text-sm">
                    Upload and manage course content
                  </p>
                  <div className="mt-4 flex items-center gap-2">
                    <Video size={16} className="text-blue-400" />
                    <span className="text-blue-300 text-sm">Add videos, quizzes, and materials</span>
                  </div>
                </Link>

                {/* My Courses Card */}
                <Link
                  to="/instructor/courses"
                  className="group bg-gradient-to-br from-purple-900/30 to-purple-900/10 rounded-2xl border border-purple-800/50 p-5 hover:border-purple-500 transition-all hover:scale-[1.02] backdrop-blur-sm"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-purple-900/50 rounded-xl">
                      <BookOpen className="text-purple-400" size={24} />
                    </div>
                    <ChevronRight className="text-purple-400 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all" size={20} />
                  </div>
                  <h4 className="font-bold text-white text-lg mb-2">My Courses</h4>
                  <p className="text-gray-400 text-sm">
                    Manage your published courses
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-purple-300 text-sm font-medium">
                      {stats.totalCourses} Courses
                    </span>
                    <span className="text-green-300 text-sm font-medium">
                      {stats.totalStudents.toLocaleString()} Students
                    </span>
                  </div>
                </Link>

                {/* Earnings Card */}
                <div className="group bg-gradient-to-br from-yellow-900/30 to-yellow-900/10 rounded-2xl border border-yellow-800/50 p-5 hover:border-yellow-500 transition-all hover:scale-[1.02] backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-yellow-900/50 rounded-xl">
                      <DollarSign className="text-yellow-400" size={24} />
                    </div>
                    <div className="text-yellow-400 font-bold">৳{stats.totalEarnings.toLocaleString()}</div>
                  </div>
                  <h4 className="font-bold text-white text-lg mb-2">Earnings</h4>
                  <p className="text-gray-400 text-sm">
                    Track your course revenue and analytics
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <Link
                      to="/instructor/earnings"
                      className="text-yellow-300 hover:text-yellow-200 text-sm font-medium flex items-center gap-1"
                    >
                      View Details
                      <ChevronRight size={14} />
                    </Link>
                    <span className="text-green-300 text-sm font-medium">
                      +৳3,240 this month
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Chart */}
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-gray-700 p-5 backdrop-blur-sm">
              <h4 className="font-bold text-white mb-4">Monthly Performance</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Earnings Trend</span>
                  <span className="text-green-400 text-sm font-medium">+24.5%</span>
                </div>
                <div className="h-40 relative">
                  {/* Simple bar chart visualization */}
                  <div className="absolute inset-0 flex items-end justify-between px-2">
                    {performanceData.map((data, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <div 
                          className="w-6 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg"
                          style={{ height: `${(data.earnings / 12000) * 100}%` }}
                        ></div>
                        <div 
                          className="w-6 bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-lg mt-1"
                          style={{ height: `${(data.students / 250) * 100}%` }}
                        ></div>
                        <span className="text-xs text-gray-500 mt-2">{data.month}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded"></div>
                    <span className="text-xs text-gray-400">Earnings</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-purple-500 rounded"></div>
                    <span className="text-xs text-gray-400">New Students</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Pending Tasks */}
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-gray-700 p-5 backdrop-blur-sm">
              <h4 className="font-bold text-white mb-4">Pending Tasks</h4>
              <div className="space-y-3">
                {[
                  { task: "Review student submissions", count: 8, type: "review" },
                  { task: "Update course content", count: 3, type: "update" },
                  { task: "Respond to questions", count: 5, type: "message" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        item.type === 'review' ? 'bg-pink-900/50' :
                        item.type === 'update' ? 'bg-blue-900/50' :
                        'bg-green-900/50'
                      }`}>
                        {item.type === 'review' ? <FileText size={16} className="text-pink-400" /> :
                         item.type === 'update' ? <Video size={16} className="text-blue-400" /> :
                         <MessageSquare size={16} className="text-green-400" />}
                      </div>
                      <div>
                        <p className="text-sm text-white">{item.task}</p>
                        <p className="text-xs text-gray-400">{item.count} pending</p>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-gray-500" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Quick Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-gray-700 p-5 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Completion Rate</p>
                <p className="text-2xl font-bold text-white">78%</p>
              </div>
              <div className="p-3 bg-green-900/50 rounded-xl">
                <CheckCircle className="text-green-400" size={24} />
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2">+5% from last month</p>
          </div>

          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-gray-700 p-5 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Avg Watch Time</p>
                <p className="text-2xl font-bold text-white">42min</p>
              </div>
              <div className="p-3 bg-blue-900/50 rounded-xl">
                <Clock className="text-blue-400" size={24} />
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2">+8min from last month</p>
          </div>

          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-gray-700 p-5 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Course Engagement</p>
                <p className="text-2xl font-bold text-white">92%</p>
              </div>
              <div className="p-3 bg-purple-900/50 rounded-xl">
                <TrendingUp className="text-purple-400" size={24} />
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2">Highly engaged students</p>
          </div>

          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-gray-700 p-5 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Student Satisfaction</p>
                <p className="text-2xl font-bold text-white">4.9/5</p>
              </div>
              <div className="p-3 bg-yellow-900/50 rounded-xl">
                <Award className="text-yellow-400" size={24} />
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2">Based on 347 reviews</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InstructorDashboard;