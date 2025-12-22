import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { courseAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";

function Courses() {
  const { token } = useAuth();
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [priceType, setPriceType] = useState("all");

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [search, category, priceType, courses]);

  const fetchCourses = async () => {
    try {
      const response = await courseAPI.getAllCourses();
      setCourses(response.data || []);
      setFilteredCourses(response.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let data = [...courses];

    if (search) {
      data = data.filter(
        (c) =>
          c.title.toLowerCase().includes(search.toLowerCase()) ||
          c.description.toLowerCase().includes(search.toLowerCase())
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

    setFilteredCourses(data);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-lg text-gray-500">Loading courses...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          📚 Explore Courses
        </h1>
        <p className="text-gray-500">
          Learn new skills from industry-ready courses
        </p>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <input
          type="text"
          placeholder="Search courses..."
          className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border rounded-lg px-4 py-2"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="all">All Categories</option>
          <option value="Web">Web Development</option>
          <option value="AI">AI / ML</option>
          <option value="Data">Data Science</option>
          <option value="General">General</option>
        </select>

        <select
          className="border rounded-lg px-4 py-2"
          value={priceType}
          onChange={(e) => setPriceType(e.target.value)}
        >
          <option value="all">All Prices</option>
          <option value="free">Free</option>
          <option value="paid">Paid</option>
        </select>

        <div className="text-gray-500 text-sm flex items-center">
          Showing {filteredCourses.length} courses
        </div>
      </div>

      {/* Courses Grid */}
      {filteredCourses.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed">
          <p className="text-xl font-semibold text-gray-700 mb-2">
            No courses found
          </p>
          <p className="text-gray-500">
            Try changing your filters
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course) => (
            <div
              key={course._id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden flex flex-col"
            >
              {/* Thumbnail */}
              <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600">
                {course.thumbnailUrl && (
                  <img
                    src={course.thumbnailUrl}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                )}

                <span className="absolute top-4 left-4 bg-black/70 text-white text-xs px-3 py-1 rounded-full">
                  {course.level || "Beginner"}
                </span>

                <span className="absolute top-4 right-4 bg-white text-blue-600 text-sm font-semibold px-3 py-1 rounded-full shadow">
                  {course.price > 0 ? `৳${course.price}` : "Free"}
                </span>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-semibold text-gray-800 mb-1 line-clamp-1">
                  {course.title}
                </h3>

                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {course.description}
                </p>

                {/* Meta */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>⏱ {course.duration || 10} hrs</span>
                  <span>⭐ {course.rating || 4.5}</span>
                </div>

                {/* CTA */}
                <div className="mt-auto">
                  <Link
                    to={`/courses/${course._id}`}
                    className="block text-center w-full py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Courses;
