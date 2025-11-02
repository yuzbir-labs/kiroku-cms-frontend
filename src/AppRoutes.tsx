import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './layouts/index';
import Landing from './pages/Landing';
import Login from './pages/Login';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Branches from './pages/Branches';
import Courses from './pages/Courses';
import CourseGroups from './pages/CourseGroups';
import Attendance from './pages/Attendance';
import Enrollments from './pages/Enrollments';
import Inquiries from './pages/Inquiries';
import Users from './pages/Users';
import Profile from './pages/Profile';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route
        path="/dashboard"
        element={
          <Layout>
            <Dashboard />
          </Layout>
        }
      />
      <Route
        path="/branches"
        element={
          <Layout>
            <Branches />
          </Layout>
        }
      />
      <Route
        path="/courses"
        element={
          <Layout>
            <Courses />
          </Layout>
        }
      />
      <Route
        path="/course-groups"
        element={
          <Layout>
            <CourseGroups />
          </Layout>
        }
      />
      <Route
        path="/attendance"
        element={
          <Layout>
            <Attendance />
          </Layout>
        }
      />
      <Route
        path="/enrollments"
        element={
          <Layout>
            <Enrollments />
          </Layout>
        }
      />
      <Route
        path="/inquiries"
        element={
          <Layout>
            <Inquiries />
          </Layout>
        }
      />
      <Route
        path="/users"
        element={
          <Layout>
            <Users />
          </Layout>
        }
      />
      <Route
        path="/profile"
        element={
          <Layout>
            <Profile />
          </Layout>
        }
      />
      <Route
        path="*"
        element={
          <Layout>
            <div>
              <h2>404 - Səhifə tapılmadı</h2>
              <p>Axtardığınız səhifə mövcud deyil.</p>
            </div>
          </Layout>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
