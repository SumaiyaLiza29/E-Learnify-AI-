import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { enrollCourse } from "../services/api";
import { useState } from "react";

const CourseDetails = () => {
  const { id } = useParams(); // courseId
  const { token } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEnroll = async () => {
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      const res = await enrollCourse(id, token);

      if (res.enrollmentId) {
        navigate("/my-courses"); // ✅ App.js route exists
      } else {
        setError(res.message || "Enrollment failed");
      }
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* course info already থাকলে সেটার নিচে */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <button onClick={handleEnroll} disabled={loading}>
        {loading ? "Enrolling..." : "Enroll Now"}
      </button>
    </div>
  );
};

export default CourseDetails;
