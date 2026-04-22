import { createBrowserRouter, Navigate } from 'react-router';
import { Layout } from './components/Layout';
import { PublicLayout } from './components/public/PublicLayout';
import { Dashboard } from './components/Dashboard';
import { RequestList } from './components/RequestList';
import { RequestDetail } from './components/RequestDetail';
import { Analytics } from './components/Analytics';
import { Login } from './components/Login';
import { Home } from './components/public/Home';
import { About } from './components/public/About';
import { Services } from './components/public/Services';
import { Contact } from './components/public/Contact';
import { SignIn } from './components/public/SignIn';
import { SignUp } from './components/public/SignUp';
import { SubmitRequest } from './components/public/SubmitRequest';
import { useAuth } from './context/AuthContext';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Layout>{children}</Layout>;
}

export const router = createBrowserRouter([
  // Public Routes
  {
    path: '/',
    element: (
      <PublicLayout>
        <Home />
      </PublicLayout>
    ),
  },
  {
    path: '/about',
    element: (
      <PublicLayout>
        <About />
      </PublicLayout>
    ),
  },
  {
    path: '/services',
    element: (
      <PublicLayout>
        <Services />
      </PublicLayout>
    ),
  },
  {
    path: '/contact',
    element: (
      <PublicLayout>
        <Contact />
      </PublicLayout>
    ),
  },
  {
    path: '/signin',
    element: <SignIn />,
  },
  {
    path: '/signup',
    element: <SignUp />,
  },
  {
    path: '/submit-request',
    element: (
      <PublicLayout>
        <SubmitRequest />
      </PublicLayout>
    ),
  },
  
  // Admin Routes
  {
    path: '/admin/login',
    element: <Login />,
  },
  {
    path: '/admin/dashboard',
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/requests',
    element: (
      <ProtectedRoute>
        <RequestList />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/requests/:id',
    element: (
      <ProtectedRoute>
        <RequestDetail />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/analytics',
    element: (
      <ProtectedRoute>
        <Analytics />
      </ProtectedRoute>
    ),
  },
  
  // Redirects
  {
    path: '/admin',
    element: <Navigate to="/admin/dashboard" replace />,
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
