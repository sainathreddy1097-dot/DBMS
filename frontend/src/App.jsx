import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';

// Public Pages
import LandingPage from './pages/public/LandingPage';
import ServicesPage from './pages/public/ServicesPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';

// Customer Pages
import CustomerDashboard from './pages/customer/CustomerDashboard';
import MyVehiclesPage from './pages/customer/MyVehiclesPage';
import BookServicePage from './pages/customer/BookServicePage';
import MyBookingsPage from './pages/customer/MyBookingsPage';
import TrackServicePage from './pages/customer/TrackServicePage';
import CustomerInvoicesPage from './pages/customer/CustomerInvoicesPage';
import RecommendationsPage from './pages/customer/RecommendationsPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminServiceRequestsPage from './pages/admin/AdminServiceRequestsPage';
import AdminMechanicsPage from './pages/admin/AdminMechanicsPage';
import AdminInventoryPage from './pages/admin/AdminInventoryPage';
import AdminInvoicesPage from './pages/admin/AdminInvoicesPage';
import AdminCustomersPage from './pages/admin/AdminCustomersPage';

// Mechanic Pages
import MechanicDashboard from './pages/mechanic/MechanicDashboard';
import MechanicJobsPage from './pages/mechanic/MechanicJobsPage';

// Protected Route Wrapper
function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'ROLE_ADMIN') return <Navigate to="/admin/dashboard" replace />;
    if (user.role === 'ROLE_MECHANIC') return <Navigate to="/mechanic/dashboard" replace />;
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

// Layout Wrapper
function Layout({ children, requiresAuth = false }) {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />
      <div className="flex-1 flex">
        {user && requiresAuth && <Sidebar />}
        <main className={`flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full ${!user || !requiresAuth ? 'max-w-7xl' : ''}`}>
          {children}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Layout><LandingPage /></Layout>} />
          <Route path="/services" element={<Layout><ServicesPage /></Layout>} />
          <Route path="/login" element={<Layout><LoginPage /></Layout>} />
          <Route path="/register" element={<Layout><RegisterPage /></Layout>} />

          {/* Customer Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['ROLE_CUSTOMER']}>
                <Layout requiresAuth><CustomerDashboard /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/vehicles"
            element={
              <ProtectedRoute allowedRoles={['ROLE_CUSTOMER']}>
                <Layout requiresAuth><MyVehiclesPage /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/book-service"
            element={
              <ProtectedRoute allowedRoles={['ROLE_CUSTOMER', 'ROLE_ADMIN']}>
                <Layout requiresAuth><BookServicePage /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/bookings"
            element={
              <ProtectedRoute allowedRoles={['ROLE_CUSTOMER']}>
                <Layout requiresAuth><MyBookingsPage /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/track-service"
            element={
              <ProtectedRoute allowedRoles={['ROLE_CUSTOMER', 'ROLE_ADMIN']}>
                <Layout requiresAuth><TrackServicePage /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/invoices"
            element={
              <ProtectedRoute allowedRoles={['ROLE_CUSTOMER']}>
                <Layout requiresAuth><CustomerInvoicesPage /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/recommendations"
            element={
              <ProtectedRoute allowedRoles={['ROLE_CUSTOMER']}>
                <Layout requiresAuth><RecommendationsPage /></Layout>
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                <Layout requiresAuth><AdminDashboard /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/service-requests"
            element={
              <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                <Layout requiresAuth><AdminServiceRequestsPage /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/mechanics"
            element={
              <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                <Layout requiresAuth><AdminMechanicsPage /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/inventory"
            element={
              <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                <Layout requiresAuth><AdminInventoryPage /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/invoices"
            element={
              <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                <Layout requiresAuth><AdminInvoicesPage /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/customers"
            element={
              <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                <Layout requiresAuth><AdminCustomersPage /></Layout>
              </ProtectedRoute>
            }
          />

          {/* Mechanic Routes */}
          <Route
            path="/mechanic/dashboard"
            element={
              <ProtectedRoute allowedRoles={['ROLE_MECHANIC']}>
                <Layout requiresAuth><MechanicDashboard /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/mechanic/jobs"
            element={
              <ProtectedRoute allowedRoles={['ROLE_MECHANIC']}>
                <Layout requiresAuth><MechanicJobsPage /></Layout>
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
