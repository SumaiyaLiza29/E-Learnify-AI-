// frontend/src/services/api.js

import axios from "axios";

const API_BASE = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* =========================
   AUTH
========================= */
export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
};

/* =========================
   COURSES
========================= */
export const courseAPI = {
  getAllCourses: () => api.get("/courses"),
  getCourseById: (id) => api.get(`/courses/${id}`),
  createCourse: (data) => api.post("/courses", data),
  updateCourse: (id, data) => api.put(`/courses/${id}`, data),
  deleteCourse: (id) => api.delete(`/courses/${id}`),
  getInstructorCourses: () => api.get("/courses/my/courses"),
};

/* =========================
   ENROLLMENTS
========================= */
export const enrollmentAPI = {
  createEnrollment: (courseId) =>
    api.post("/enrollments", { courseId }),
  getMyEnrollments: () =>
    api.get("/enrollments/my-enrollments"),
  getEnrollmentById: (id) =>
    api.get(`/enrollments/${id}`),
  updateProgress: (id, progress) =>
    api.put(`/enrollments/${id}/progress`, { progress }),
};

/* =========================
   PAYMENTS
========================= */
export const paymentAPI = {
  initiatePayment: (enrollmentId) =>
    api.post("/payments/init", { enrollmentId }),

  checkInvoice: (enrollmentId) =>
    api.get(`/payments/invoice-check/${enrollmentId}`),

  downloadInvoice: (enrollmentId) =>
    window.open(
      `${API_BASE}/payments/invoice/${enrollmentId}`,
      "_blank"
    ),
};

export const getMyCertificates = async (token) => {
  const res = await fetch(`${API_BASE}/certificates/my`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch certificates");
  }

  return res.json();
};


export default api;
