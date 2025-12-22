import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { enrollmentAPI, certificateAPI } from '../services/api';

function EnrollmentDetails() {
  const { id } = useParams();
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEnrollment();
  }, [id]);

  const fetchEnrollment = async () => {
    try {
      const response = await enrollmentAPI.getEnrollmentById(id);
      setEnrollment(response.data);
    } catch (error) {
      console.error('Error fetching enrollment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProgress = async (newProgress) => {
    try {
      await enrollmentAPI.updateProgress(id, newProgress);
      alert('Progress updated!');
      fetchEnrollment();
    } catch (error) {
      alert('Failed to update progress');
    }
  };

  const handleDownloadCertificate = () => {
    if (enrollment.certificateFileName) {
      const downloadUrl = certificateAPI.downloadCertificate(enrollment.certificateFileName);
      window.open(downloadUrl, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!enrollment) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Enrollment not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6">{enrollment.courseTitle}</h1>

        <div className="mb-6">
          <h2 className="text-xl font-bold mb-3">Progress</h2>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-green-600 h-4 rounded-full"
                  style={{ width: `${enrollment.progress}%` }}
                ></div>
              </div>
            </div>
            <span className="text-lg font-bold">{enrollment.progress}%</span>
          </div>

          {/* Progress Update Buttons (for testing) */}
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => handleUpdateProgress(25)}
              className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
            >
              25%
            </button>
            <button
              onClick={() => handleUpdateProgress(50)}
              className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
            >
              50%
            </button>
            <button
              onClick={() => handleUpdateProgress(75)}
              className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
            >
              75%
            </button>
            <button
              onClick={() => handleUpdateProgress(100)}
              className="bg-green-500 text-white px-3 py-1 rounded text-sm"
            >
              100%
            </button>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-bold mb-3">Details</h2>
          <div className="space-y-2">
            <p><strong>Enrolled:</strong> {new Date(enrollment.enrollmentDate).toLocaleDateString()}</p>
            <p><strong>Payment Status:</strong> 
              <span className={`ml-2 px-3 py-1 rounded-full text-sm ${
                enrollment.paymentStatus === 'completed' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {enrollment.paymentStatus}
              </span>
            </p>
            {enrollment.completionDate && (
              <p><strong>Completed:</strong> {new Date(enrollment.completionDate).toLocaleDateString()}</p>
            )}
          </div>
        </div>

        {/* Certificate Section */}
        {enrollment.progress === 100 && enrollment.certificateUrl && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h2 className="text-xl font-bold text-green-800 mb-3">🎉 Certificate Available!</h2>
            <p className="text-gray-700 mb-4">
              Congratulations! You've completed the course. Download your certificate below.
            </p>
            <button
              onClick={handleDownloadCertificate}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              Download Certificate
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default EnrollmentDetails;