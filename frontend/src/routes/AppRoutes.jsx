import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PrivateRoute from './PrivateRoute';
import AdminRoute from './AdminRoute';
import PublicRoute from './PublicRoute';
import LoadingScreen from '../components/common/LoadingScreen';
import RouteTransition from '../components/common/RouteTransition';

// Auth Pages
const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('../pages/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('../pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('../pages/auth/ResetPasswordPage'));
const VerifyEmailPage = lazy(() => import('../pages/auth/VerifyEmailPage'));
const DisabledAccountPage = lazy(() => import('../pages/auth/DisabledAccountPage'));

// Patient Pages
const DashboardPage = lazy(() => import('../pages/patient/DashboardPage'));
const PredictionPage = lazy(() => import('../pages/patient/PredictionPage'));
const HistoryPage = lazy(() => import('../pages/patient/HistoryPage'));
const DietExercisePage = lazy(() => import('../pages/patient/DietExercisePage'));
const MedicationReminderPage = lazy(() => import('../pages/patient/MedicationReminderPage'));
const ProfilePage = lazy(() => import('../pages/patient/ProfilePage'));
const NotificationsPage = lazy(() => import('../pages/patient/NotificationsPage'));

// Admin Pages
const AdminDashboardPage = lazy(() => import('../pages/admin/AdminDashboardPage'));
const UserManagementPage = lazy(() => import('../pages/admin/UserManagementPage'));
const PredictionManagementPage = lazy(() => import('../pages/admin/PredictionManagementPage'));
const ReportManagementPage = lazy(() => import('../pages/admin/ReportManagementPage'));
const ActivityLogsPage = lazy(() => import('../pages/admin/ActivityLogsPage'));

// Layouts
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';
import AdminLayout from '../layouts/AdminLayout';

const AppRoutes = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  return (
    <Suspense fallback={<LoadingScreen />}>
      <RouteTransition>
        <Routes>
          {/* Auth routes - public only when not logged in */}
          <Route element={<PublicRoute />}>
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/verify-email" element={<VerifyEmailPage />} />
            </Route>
          </Route>

          {/* Patient routes */}
          <Route element={<PrivateRoute />}>
            <Route element={<MainLayout />}>
              {/* Primary pages */}
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/prediction" element={<PredictionPage />} />
              <Route path="/history" element={<HistoryPage />} />

              {/* Lifestyle */}
              <Route path="/diet-exercise" element={<DietExercisePage />} />
              <Route path="/medications" element={<MedicationReminderPage />} />

              {/* Legacy redirects */}
              <Route path="/diet" element={<Navigate to="/diet-exercise" replace />} />
              <Route path="/exercise" element={<Navigate to="/diet-exercise" replace />} />
              <Route path="/analytics" element={<Navigate to="/dashboard" replace />} />
              <Route path="/comparison" element={<Navigate to="/dashboard" replace />} />
              <Route path="/report-upload" element={<Navigate to="/prediction" replace />} />
              <Route path="/ai-coach" element={<Navigate to="/dashboard" replace />} />

              {/* Account */}
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
            </Route>
          </Route>

          {/* Admin routes */}
          <Route element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route path="/admin/users" element={<UserManagementPage />} />
              <Route path="/admin/predictions" element={<PredictionManagementPage />} />
              <Route path="/admin/reports" element={<Navigate to="/admin" replace />} />
              <Route path="/admin/activity" element={<ActivityLogsPage />} />
              <Route path="/admin/profile" element={<ProfilePage />} />
            </Route>
          </Route>

          {/* Disabled account status route */}
          <Route path="/disabled" element={isAuthenticated ? <DisabledAccountPage /> : <Navigate to="/login" replace />} />

          {/* Fallback */}
          <Route
            path="*"
            element={
              <Navigate
                to={
                  isAuthenticated
                    ? user?.enabled === false
                      ? '/disabled'
                      : user?.role === 'ADMIN'
                      ? '/admin'
                      : '/dashboard'
                    : '/login'
                }
              />
            }
          />
        </Routes>
      </RouteTransition>
    </Suspense>
  );
};

export default AppRoutes;