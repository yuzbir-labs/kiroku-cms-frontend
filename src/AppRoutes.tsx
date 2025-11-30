import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from 'layouts/index';
import { ProtectedRoute } from 'components';
import Landing from 'pages/core/Landing';
import Login from 'pages/core/Login';
import ResetPassword from 'pages/core/ResetPassword';
import Dashboard from 'pages/core/Dashboard';
import Branches from 'pages/main/Branches';
import Courses from 'pages/main/Courses';
import CourseGroups from 'pages/main/CourseGroups';
import MyGroups from 'pages/main/MyGroups';
import GroupDetails from 'pages/main/GroupDetails';
import Enrollments from 'pages/main/Enrollments';
import Inquiries from 'pages/main/Inquiries';
import Users from 'pages/main/Users';
import Profile from 'pages/core/Profile';
import { UserRoles } from 'utils/permissions';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Protected Routes - Dashboard (Not for students) */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute
            allowedRoles={[
              UserRoles.ORGANIZATION_ADMIN,
              UserRoles.BRANCH_ADMIN,
              UserRoles.BRANCH_MANAGER,
              UserRoles.TEACHER,
              UserRoles.PARENT,
            ]}
          >
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Protected Routes - Branches (Admins and Managers only) */}
      <Route
        path="/branches"
        element={
          <ProtectedRoute
            allowedRoles={[
              UserRoles.ORGANIZATION_ADMIN,
              UserRoles.BRANCH_ADMIN,
              UserRoles.BRANCH_MANAGER,
            ]}
          >
            <Layout>
              <Branches />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Protected Routes - Courses (Not for students) */}
      <Route
        path="/courses"
        element={
          <ProtectedRoute
            allowedRoles={[
              UserRoles.ORGANIZATION_ADMIN,
              UserRoles.BRANCH_ADMIN,
              UserRoles.BRANCH_MANAGER,
              UserRoles.TEACHER,
            ]}
          >
            <Layout>
              <Courses />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Protected Routes - Course Groups (Admins and Managers only) */}
      <Route
        path="/courses/:courseId/groups"
        element={
          <ProtectedRoute
            allowedRoles={[
              UserRoles.ORGANIZATION_ADMIN,
              UserRoles.BRANCH_ADMIN,
              UserRoles.BRANCH_MANAGER,
            ]}
          >
            <Layout>
              <CourseGroups />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Protected Routes - My Groups (Teachers and Students) */}
      <Route
        path="/my-groups"
        element={
          <ProtectedRoute allowedRoles={[UserRoles.TEACHER, UserRoles.STUDENT]}>
            <Layout>
              <MyGroups />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Protected Routes - Group Details (All authenticated users) */}
      <Route
        path="/groups/:groupId"
        element={
          <ProtectedRoute>
            <Layout>
              <GroupDetails />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Protected Routes - Enrollments (Admins and Managers only) */}
      <Route
        path="/enrollments"
        element={
          <ProtectedRoute
            allowedRoles={[
              UserRoles.ORGANIZATION_ADMIN,
              UserRoles.BRANCH_ADMIN,
              UserRoles.BRANCH_MANAGER,
            ]}
          >
            <Layout>
              <Enrollments />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Protected Routes - Inquiries (Admins and Managers only) */}
      <Route
        path="/inquiries"
        element={
          <ProtectedRoute
            allowedRoles={[
              UserRoles.ORGANIZATION_ADMIN,
              UserRoles.BRANCH_ADMIN,
              UserRoles.BRANCH_MANAGER,
            ]}
          >
            <Layout>
              <Inquiries />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Protected Routes - Users (Admins and Managers only) */}
      <Route
        path="/users"
        element={
          <ProtectedRoute
            allowedRoles={[
              UserRoles.ORGANIZATION_ADMIN,
              UserRoles.BRANCH_ADMIN,
              UserRoles.BRANCH_MANAGER,
            ]}
          >
            <Layout>
              <Users />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Protected Routes - Profile (All authenticated users) */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Layout>
              <Profile />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* 404 Route */}
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
