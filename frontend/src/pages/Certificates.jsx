import React, { useEffect, useState } from "react";
import axios from "axios";

function Certificates() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:5000/api/certificates/my-certificates",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCertificates(res.data);
      } catch (error) {
        console.error("Certificate load failed", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
        <div className="text-xl animate-pulse">Loading certificates...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <h1 className="text-3xl font-bold text-white mb-6">My Certificates</h1>

      {certificates.length === 0 ? (
        <p className="text-gray-400">
          You have not completed any courses yet.
        </p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {certificates.map((cert) => (
            <div
              key={cert._id}
              className="bg-gray-800 shadow-xl rounded-2xl p-6 text-white hover:shadow-2xl transition"
            >
              <h2 className="text-xl font-semibold mb-2">{cert.courseTitle}</h2>

              <p className="text-gray-400 text-sm">
                Completed on:{" "}
                {new Date(cert.completionDate).toLocaleDateString()}
              </p>

              <a
                href={cert.certificateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Download Certificate →
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Certificates;
