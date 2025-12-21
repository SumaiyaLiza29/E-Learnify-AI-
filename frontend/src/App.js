import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import CourseDetails from './pages/CourseDetails';
import CreateCourse from './pages/CreateCourse';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFailed from './pages/PaymentFailed';
import MyCourses from './pages/MyCourses';
import Profile from './pages/Profile';
import Certificates from './pages/Certificates';
import Settings from './pages/Settings';
import AIAssistant from './pages/AIAssistant';

// Protected Route Component
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import InstructorRoute from './components/InstructorRoute';

// Context
import { AuthProvider } from './context/AuthContext';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="App min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/courses/:id" element={<CourseDetails />} />
                <Route path="/ai-assistant" element={<AIAssistant />} />
                
                {/* Protected Routes for All Authenticated Users */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                
                <Route path="/my-courses" element={
                  <ProtectedRoute>
                    <MyCourses />
                  </ProtectedRoute>
                } />
                
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                
                <Route path="/certificates" element={
                  <ProtectedRoute>
                    <Certificates />
                  </ProtectedRoute>
                } />
                
                <Route path="/settings" element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                } />
                
                <Route path="/payment-success" element={
                  <ProtectedRoute>
                    <PaymentSuccess />
                  </ProtectedRoute>
                } />
                
                <Route path="/payment-failed" element={
                  <ProtectedRoute>
                    <PaymentFailed />
                  </ProtectedRoute>
                } />
                
                {/* Instructor Only Routes */}
                <Route path="/create-course" element={
                  <InstructorRoute>
                    <CreateCourse />
                  </InstructorRoute>
                } />
                
                <Route path="/instructor-dashboard" element={
                  <InstructorRoute>
                    <Dashboard type="instructor" />
                  </InstructorRoute>
                } />
                
                {/* Admin Only Routes */}
                <Route path="/admin" element={
                  <AdminRoute>
                    <Dashboard type="admin" />
                  </AdminRoute>
                } />
                
                {/* 404 Route */}
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </main>
            <Footer />
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  theme: {
                    primary: 'green',
                    secondary: 'black',
                  },
                },
                error: {
                  duration: 4000,
                },
              }}
            />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;