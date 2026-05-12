import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { useAuth } from './hooks/useAuth';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import MainLayout from './components/layout/MainLayout';
import DashboardPage from './components/dashboard/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import NotificationsPage from './pages/NotificationsPage';
import UsersPage from './components/users/UsersPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { RequestListPage } from './pages/RequestListPage';
import VolunteersPage from './components/dashboard/VolunteersPage';
import SettingsPage from './components/dashboard/SettingsPage';
import VolunteerTasksPage from './components/dashboard/VolunteerTasksPage';
import VolunteerRequestsPage from './components/dashboard/VolunteerRequestsPage';
import HelpPage from './components/dashboard/HelpPage';
import OrgRequestsPage from './components/dashboard/OrgRequestsPage';
import TeamPage from './components/dashboard/TeamPage';
import OrgSettingsPage from './components/dashboard/OrgSettingsPage';
import RequestSubmissionPage from './pages/RequestSubmissionPage';
import RequestDetailPage from './pages/RequestDetailPage';
import RequestTrackingPage from './pages/RequestTrackingPage';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import LiveActivityPage from './pages/LiveActivityPage';
import ContactPage from './pages/ContactPage';
import ServicesPage from './pages/ServicesPage';
import TermsPage from './pages/TermsPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import { getDefaultRouteForRole, hasRequiredRole } from './lib/permissions';
import SkipLink from './components/common/SkipLink';
import useScrollReveal from './hooks/useScrollReveal';
import './App.css';
import './styles/scroll-animations.css';

// Protect routes - redirect to login if not authenticated
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, loading, user } = useAuth();
  if (loading) return null;
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!hasRequiredRole(user, allowedRoles)) {
    return <Navigate to={getDefaultRouteForRole(user)} replace />;
  }

  return children;
};

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useScrollReveal([pathname]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });

    // Dashboard pages can scroll inside this container instead of the window.
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
      mainContent.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }
  }, [pathname]);

  return null;
};

function AppRouter() {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/live-activity" element={<LiveActivityPage />} />
      <Route path="/submit-emergency-request" element={<RequestSubmissionPage />} />
      <Route path="/track" element={<RequestTrackingPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
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
          <ProtectedRoute allowedRoles={['admin']}>
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
          <ProtectedRoute allowedRoles={['admin']}>
            <MainLayout>
              <RequestListPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/requests/:id"
        element={
          <ProtectedRoute allowedRoles={['admin', 'coordinator', 'organization_staff', 'volunteer']}>
            <MainLayout>
              <RequestDetailPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/volunteers"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <MainLayout>
              <VolunteersPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/analytics"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <MainLayout>
              <AnalyticsPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <MainLayout>
              <SettingsPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Volunteer routes */}
      <Route
        path="/volunteer/tasks"
        element={
          <ProtectedRoute allowedRoles={['volunteer']}>
            <MainLayout>
              <VolunteerTasksPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/volunteer/requests"
        element={
          <ProtectedRoute allowedRoles={['volunteer']}>
            <MainLayout>
              <VolunteerRequestsPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/volunteer/profile"
        element={
          <ProtectedRoute allowedRoles={['volunteer']}>
            <MainLayout>
              <ProfilePage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/volunteer/help"
        element={
          <ProtectedRoute allowedRoles={['volunteer']}>
            <MainLayout>
              <HelpPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Organization staff routes */}
      <Route
        path="/org/submit-request"
        element={
          <ProtectedRoute allowedRoles={['coordinator', 'organization_staff']}>
            <RequestSubmissionPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/org/requests"
        element={
          <ProtectedRoute allowedRoles={['coordinator', 'organization_staff']}>
            <MainLayout>
              <OrgRequestsPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/org/team"
        element={
          <ProtectedRoute allowedRoles={['coordinator', 'organization_staff']}>
            <MainLayout>
              <TeamPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/org/settings"
        element={
          <ProtectedRoute allowedRoles={['coordinator', 'organization_staff']}>
            <MainLayout>
              <OrgSettingsPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <SkipLink />
        <AuthProvider>
          <ScrollToTop />
          <AppRouter />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
