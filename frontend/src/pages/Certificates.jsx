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
            headers: {
              Authorization: `Bearer ${token}`,
            },
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
    return <div className="p-8">Loading certificates...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">My Certificates</h1>

      {certificates.length === 0 ? (
        <p className="text-gray-600">
          You have not completed any courses yet.
        </p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {certificates.map((cert) => (
            <div key={cert._id} className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold">
                {cert.courseTitle}
              </h2>

              <p className="text-sm text-gray-500 mt-2">
                Completed on:{" "}
                {new Date(cert.completionDate).toLocaleDateString()}
              </p>

              <a
                href={cert.certificateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 text-blue-600 hover:underline"
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
