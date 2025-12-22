import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials)
};

// Course APIs
export const courseAPI = {
  getAllCourses: () => api.get('/courses'),
  getCourseById: (id) => api.get(`/courses/${id}`),
  createCourse: (courseData) => api.post('/courses', courseData),
  updateCourse: (id, courseData) => api.put(`/courses/${id}`, courseData),
  deleteCourse: (id) => api.delete(`/courses/${id}`),
  getInstructorCourses: () => api.get('/courses/my/courses')
};

// Enrollment APIs (নতুন)
export const enrollmentAPI = {
  createEnrollment: (courseId) => api.post('/enrollments', { courseId }),
  getMyEnrollments: () => api.get('/enrollments/my-enrollments'),
  getEnrollmentById: (id) => api.get(`/enrollments/${id}`),
  updateProgress: (id, progress) => api.put(`/enrollments/${id}/progress`, { progress })
};

// Payment APIs (নতুন)
export const paymentAPI = {
  initiatePayment: (enrollmentId) => api.post('/payments/initiate', { enrollmentId })
};


export const getMyCertificates = async (token) => {
  const res = await fetch("http://localhost:5000/api/certificates/my", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
};



const API_BASE = "http://localhost:5000/api";

// =======================
// ENROLL COURSE
// =======================
export const enrollCourse = async (courseId, token) => {
  const res = await fetch(`${API_BASE}/enrollments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ courseId }),
  });

  return res.json();
};

export const getInvoiceByEnrollment = async (enrollmentId, token) => {
  const res = await fetch(
    `http://localhost:5000/api/invoices/${enrollmentId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.json();
};

export default api;