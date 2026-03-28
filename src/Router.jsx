import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import MainLayout from './components/layout/MainLayout';
import DashboardPage from './components/dashboard/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import NotificationsPage from './pages/NotificationsPage';
import UsersPage from './components/users/UsersPage';
import Placeholder from './components/common/Placeholder';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { RequestListPage } from './pages/RequestListPage';
import RequestDetailPage from './pages/RequestDetailPage';
import './App.css';

// Protect routes - redirect to login if not authenticated
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function AppRouter() {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />}
      />
      <Route
        path="/register"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage />}
      />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <MainLayout>
              <DashboardPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <MainLayout>
              <ProfilePage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <MainLayout>
              <NotificationsPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
{/* Core pages */}
      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <MainLayout>
              <UsersPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Admin routes */}
      <Route
        path="/admin/requests"
        element={
          <ProtectedRoute>
            <MainLayout>
              <RequestListPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/requests/:id"
        element={
          <ProtectedRoute>
            <MainLayout>
              <RequestDetailPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/volunteers"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Placeholder title="Volunteers" description="Admin volunteer management" />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/analytics"
        element={
          <ProtectedRoute>
            <MainLayout>
              <AnalyticsPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Placeholder title="Settings" description="Admin settings and configuration" />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Volunteer routes */}
      <Route
        path="/volunteer/tasks"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Placeholder title="My Tasks" description="Volunteer task list" />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/volunteer/requests"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Placeholder title="Available Requests" description="Volunteer available requests" />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/volunteer/profile"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Placeholder title="My Profile" description="Volunteer profile" />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/volunteer/help"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Placeholder title="Help" description="Volunteer help and documentation" />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Organization staff routes */}
      <Route
        path="/org/submit-request"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Placeholder title="Submit Request" description="Organization: submit a new request" />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/org/requests"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Placeholder title="My Requests" description="Organization requests" />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/org/team"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Placeholder title="Team Members" description="Organization team management" />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/org/settings"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Placeholder title="Organization Settings" description="Organization settings" />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />}
      />
    </Routes>
  );
}
export default AppRouter;