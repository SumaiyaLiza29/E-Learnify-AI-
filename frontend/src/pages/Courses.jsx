import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { courseAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
  Search,
  Filter,
  Clock,
  Star,
  TrendingUp,
  Users,
  BookOpen,
  ArrowRight,
  Sparkles,
  Zap,
  Target,
  Award,
  PlayCircle,
  Tag,
  Globe,
  ChevronRight,
  X,
  Shield,
  Rocket
} from "lucide-react";

const BACKEND_URL = "http://localhost:5000";

function Courses() {
  const { token } = useAuth();
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [activeTags, setActiveTags] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);

  // Filters
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [priceType, setPriceType] = useState("all");
  const [level, setLevel] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [search, category, priceType, level, sortBy, courses]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await courseAPI.getAllCourses();
      const data = res.data || [];
      setCourses(data);
      setFilteredCourses(data);

      // Extract unique categories
      const uniqueCategories = [...new Set(data.map((c) => c.category))];
      setCategories(uniqueCategories.filter(Boolean));

      // Extract popular tags
      const allTags = data.flatMap(c => c.tags || []).filter(Boolean);
      const popularTags = [...new Set(allTags)].slice(0, 8);
      setActiveTags(popularTags);
    } catch (err) {
      console.error("Fetch courses error:", err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let data = [...courses];

    if (search) {
      data = data.filter(
        (c) =>
          c.title?.toLowerCase().includes(search.toLowerCase()) ||
          c.description?.toLowerCase().includes(search.toLowerCase()) ||
          (c.tags && c.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase())))
      );
    }

    if (category !== "all") {
      data = data.filter((c) => c.category === category);
    }

    if (priceType === "free") {
      data = data.filter((c) => Number(c.price) === 0);
    }

    if (priceType === "paid") {
      data = data.filter((c) => Number(c.price) > 0);
    }

    if (level !== "all") {
      data = data.filter(
        (c) => c.level && c.level.toLowerCase() === level.toLowerCase()
      );
    }

    // Sorting
    switch (sortBy) {
      case "rating":
        data.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "price-low":
        data.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case "price-high":
        data.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case "students":
        data.sort((a, b) => (b.students || 0) - (a.students || 0));
        break;
      default:
        data.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }

    setFilteredCourses(data);
  };

  const resetFilters = () => {
    setSearch("");
    setCategory("all");
    setPriceType("all");
    setLevel("all");
    setSortBy("newest");
  };

  const addTagFilter = (tag) => {
    setSearch(prev => prev ? `${prev} ${tag}` : tag);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex flex-col items-center justify-center">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-gray-800 border-t-purple-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 border-4 border-transparent border-t-blue-500 rounded-full animate-spin animate-reverse"></div>
          <Sparkles className="absolute -top-2 -right-2 text-purple-400 animate-pulse" size={24} />
        </div>
        <p className="mt-6 text-xl font-medium text-gray-300">Discovering Amazing Courses...</p>
        <p className="text-sm text-gray-500 mt-2">Just a moment</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-900/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-900/5 rounded-full blur-3xl"></div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-gray-800">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-blue-900/10"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-28">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-900/30 to-blue-900/30 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-purple-500/20">
              <Rocket className="text-yellow-400" size={16} />
              <span className="text-yellow-100 text-sm font-medium">✨ {courses.length}+ Courses Available</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400">
                Master
              </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
                {" "}New Skills
              </span>
            </h1>
            
            <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-10">
              Learn from industry experts. Build your future with hands-on projects and career-ready skills.
            </p>

            {/* Search Bar */}
            <div className="max-w-3xl mx-auto relative">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
                <div className="relative flex items-center bg-gray-900 rounded-2xl">
                  <Search className="absolute left-4 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search courses, instructors, or topics..."
                    className="w-full pl-12 pr-4 py-4 bg-transparent border-0 focus:ring-0 text-gray-200 placeholder-gray-500"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <button className="m-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:opacity-90 transition hover:shadow-lg hover:shadow-purple-500/20">
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-6 py-10">
        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          {[
            { icon: BookOpen, value: courses.length, label: "Total Courses", color: "blue", change: "+12" },
            { icon: Users, value: "10K+", label: "Active Students", color: "green", change: "+256" },
            { icon: Award, value: "4.8", label: "Avg Rating", color: "purple", change: "+0.2" },
            { icon: TrendingUp, value: "95%", label: "Success Rate", color: "yellow", change: "+5%" }
          ].map((stat, index) => (
            <div 
              key={index}
              className={`bg-gradient-to-br ${
                stat.color === 'blue' ? 'from-blue-900/30 to-blue-900/10' :
                stat.color === 'green' ? 'from-emerald-900/30 to-emerald-900/10' :
                stat.color === 'purple' ? 'from-purple-900/30 to-purple-900/10' :
                'from-yellow-900/30 to-yellow-900/10'
              } backdrop-blur-sm rounded-2xl p-4 border border-gray-800 hover:border-gray-700 transition-all hover:scale-[1.02]`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg ${
                  stat.color === 'blue' ? 'bg-blue-900/50' :
                  stat.color === 'green' ? 'bg-emerald-900/50' :
                  stat.color === 'purple' ? 'bg-purple-900/50' :
                  'bg-yellow-900/50'
                }`}>
                  <stat.icon size={20} className={
                    stat.color === 'blue' ? 'text-blue-400' :
                    stat.color === 'green' ? 'text-emerald-400' :
                    stat.color === 'purple' ? 'text-purple-400' :
                    'text-yellow-400'
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

        {/* Filters & Controls */}
        <div className="mb-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Filter className="text-purple-400" size={20} />
                Find Your Perfect Course
              </h2>
              <p className="text-gray-400">Filter by your preferences</p>
            </div>
            
            <div className="flex items-center gap-3">
              <select
                className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="rating">Highest Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="students">Most Students</option>
              </select>
              
              <button
                onClick={resetFilters}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition border border-gray-700"
              >
                <X size={16} />
                Reset
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <select
              className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-200"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <select
              className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-200"
              value={priceType}
              onChange={(e) => setPriceType(e.target.value)}
            >
              <option value="all">All Prices</option>
              <option value="free">Free Courses</option>
              <option value="paid">Paid Courses</option>
            </select>

            <select
              className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-200"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
            >
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>

            <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl px-4 py-3 border border-gray-700">
              <p className="text-sm text-gray-400">Showing</p>
              <p className="text-xl font-bold text-white">{filteredCourses.length} of {courses.length} courses</p>
            </div>
          </div>

          {/* Popular Tags */}
          {activeTags.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <Tag className="text-blue-400" size={18} />
                <span className="text-gray-300 font-medium">Popular Tags:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {activeTags.map((tag, index) => (
                  <button
                    key={index}
                    onClick={() => addTagFilter(tag)}
                    className="px-3 py-1.5 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 rounded-lg text-sm text-gray-300 hover:text-white transition border border-gray-700 hover:border-blue-500/50"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Courses Grid */}
        {filteredCourses.length === 0 ? (
          <div className="text-center py-20 bg-gradient-to-br from-gray-900/50 to-black/50 rounded-3xl border-2 border-dashed border-gray-800 backdrop-blur-sm">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-gray-800 to-gray-900 flex items-center justify-center border border-gray-700">
                <Search className="text-gray-400" size={40} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">No courses found</h3>
              <p className="text-gray-400 mb-6">
                Try adjusting your filters or search term
              </p>
              <button
                onClick={resetFilters}
                className="group inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition hover:shadow-lg hover:shadow-purple-500/20"
              >
                Reset All Filters
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {filteredCourses.map((course) => (
                <div
                  key={course._id}
                  className="group bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-3xl border border-gray-800 hover:border-purple-500/50 transition-all duration-300 overflow-hidden hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-1 backdrop-blur-sm"
                >
                  {/* Course Image */}
                  <div className="relative h-56 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-900/50 to-blue-900/50">
                      {course.thumbnailUrl ? (
                        <img
                          src={`${BACKEND_URL}/${course.thumbnailUrl}`}
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                          <BookOpen className="text-gray-700" size={48} />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                    </div>
                    
                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm ${
                        course.level?.toLowerCase() === 'beginner' 
                          ? 'bg-green-900/70 text-green-300 border border-green-700/50' 
                          : course.level?.toLowerCase() === 'intermediate'
                          ? 'bg-yellow-900/70 text-yellow-300 border border-yellow-700/50'
                          : 'bg-red-900/70 text-red-300 border border-red-700/50'
                      }`}>
                        {course.level || "Beginner"}
                      </span>
                      <span className={`px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm ${
                        Number(course.price) > 0 
                          ? 'bg-blue-900/70 text-blue-300 border border-blue-700/50' 
                          : 'bg-green-900/70 text-green-300 border border-green-700/50'
                      }`}>
                        {course.price > 0 ? `৳${course.price}` : "FREE"}
                      </span>
                    </div>
                    
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-bold text-white line-clamp-2 drop-shadow-lg">
                        {course.title}
                      </h3>
                    </div>
                  </div>

                  {/* Course Content */}
                  <div className="p-6">
                    <p className="text-gray-400 mb-4 line-clamp-2">
                      {course.description}
                    </p>

                    {/* Instructor Info */}
                    {course.instructor && (
                      <div className="flex items-center gap-3 mb-4 p-3 bg-gray-800/50 rounded-xl">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-900 to-blue-900 rounded-full flex items-center justify-center">
                          <Users size={16} className="text-purple-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">Instructor</p>
                          <p className="text-xs text-gray-400">{course.instructor.name || "Expert Instructor"}</p>
                        </div>
                      </div>
                    )}

                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-sm mb-6">
                      <div className="flex items-center gap-4 text-gray-400">
                        <span className="flex items-center gap-1.5">
                          <Clock size={16} className="text-blue-400" />
                          {course.duration || 10}h
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Star size={16} className="text-yellow-400 fill-yellow-400/20" />
                          {course.rating || 4.5}
                        </span>
                        {course.students && (
                          <span className="flex items-center gap-1.5">
                            <Users size={16} className="text-green-400" />
                            {course.students}
                          </span>
                        )}
                      </div>
                      <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-xs font-medium border border-gray-700">
                        {course.category || "General"}
                      </span>
                    </div>

                    {/* Tags */}
                    {course.tags && course.tags.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                          {course.tags.slice(0, 3).map((tag, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-800/70 text-gray-400 text-xs rounded-lg border border-gray-700">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* CTA */}
                    <Link
                      to={`/courses/${course._id}`}
                      className="group/btn w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold hover:from-purple-700 hover:to-blue-700 transition-all hover:shadow-lg hover:shadow-purple-500/20"
                    >
                      <PlayCircle size={18} />
                      View Course Details
                      <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More Button */}
            {filteredCourses.length > 9 && (
              <div className="text-center">
                <button className="group inline-flex items-center gap-2 border-2 border-gray-700 hover:border-purple-500 text-gray-300 hover:text-white px-8 py-3.5 rounded-xl font-semibold transition-all hover:bg-gray-800/50">
                  Load More Courses
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}
          </>
        )}

        {/* Featured Categories */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Target className="text-pink-400" size={20} />
                Popular Categories
              </h2>
              <p className="text-gray-400">Explore courses by category</p>
            </div>
            <Link 
              to="/categories" 
              className="text-pink-400 hover:text-pink-300 font-medium flex items-center gap-1"
            >
              View All
              <ChevronRight size={16} />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "Web Development", icon: "💻", count: 42, color: "from-blue-600 to-cyan-600" },
              { name: "Data Science", icon: "📊", count: 28, color: "from-purple-600 to-pink-600" },
              { name: "UI/UX Design", icon: "🎨", count: 35, color: "from-green-600 to-emerald-600" },
              { name: "Mobile Dev", icon: "📱", count: 24, color: "from-yellow-600 to-orange-600" },
            ].map((cat, index) => (
              <div 
                key={index}
                className="group bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-gray-800 hover:border-gray-700 transition-all hover:scale-[1.02] backdrop-blur-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl">{cat.icon}</span>
                  <span className="text-sm text-gray-400">{cat.count} courses</span>
                </div>
                <h3 className="font-bold text-white mb-2">{cat.name}</h3>
                <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                  <div className={`h-full bg-gradient-to-r ${cat.color} rounded-full`} style={{ width: '75%' }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Courses;