
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { useAuth } from '@/contexts/AuthContext';

// Pages
import { Index } from '@/pages/Index';
import { Login } from '@/pages/auth/Login';
import { BoxRegister } from '@/pages/auth/BoxRegister';
import { StudentRegister } from '@/pages/auth/StudentRegister';
import { NotFound } from '@/pages/NotFound';

// Box Pages
import { BoxDashboard } from '@/pages/box/BoxDashboard';
import { AthleteManagement } from '@/pages/box/AthleteManagement';
import { TrainerManagement } from '@/pages/box/TrainerManagement';
import { ClassManagement } from '@/pages/box/ClassManagement';
import { Reports } from '@/pages/box/Reports';
import { BoxCRM } from '@/pages/box/BoxCRM';
import { Financial } from '@/pages/box/Financial';
import { BoxSettings } from '@/pages/box/BoxSettings';

// Student Pages
import { StudentDashboard } from '@/pages/student/StudentDashboard';
import { BookingManagement } from '@/pages/student/BookingManagement';
import { ProgressTracking } from '@/pages/student/ProgressTracking';
import { PaymentManagement } from '@/pages/student/PaymentManagement';

// Trainer Pages
import { TrainerDashboard } from '@/pages/trainer/TrainerDashboard';
import { TrainerStudents } from '@/pages/trainer/TrainerStudents';
import { TrainerWorkoutPlans } from '@/pages/trainer/TrainerWorkoutPlans';
import { TrainerNutritionPlans } from '@/pages/trainer/TrainerNutritionPlans';

// Admin Pages
import { CagioAdminDashboard } from '@/pages/admin/CagioAdminDashboard';
import { BoxManagement } from '@/pages/admin/BoxManagement';
import { UserManagement } from '@/pages/admin/UserManagement';
import { BoxOnboarding } from '@/pages/admin/BoxOnboarding';
import { AdminReports } from '@/pages/admin/Reports';

import { ProtectedRoute } from '@/components/ProtectedRoute';

const AppContent: React.FC = () => {
  const { user } = useAuth();

  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Index />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/box-register" element={<BoxRegister />} />
          <Route path="/auth/student-register" element={<StudentRegister />} />

          {/* Box routes */}
          <Route path="/box" element={
            <ProtectedRoute allowedRoles={['box_admin']}>
              <Navigate to="/box/dashboard" replace />
            </ProtectedRoute>
          } />
          <Route path="/box/dashboard" element={
            <ProtectedRoute allowedRoles={['box_admin']}>
              <BoxDashboard />
            </ProtectedRoute>
          } />
          <Route path="/box/athletes" element={
            <ProtectedRoute allowedRoles={['box_admin', 'trainer']}>
              <AthleteManagement />
            </ProtectedRoute>
          } />
          <Route path="/box/trainers" element={
            <ProtectedRoute allowedRoles={['box_admin']}>
              <TrainerManagement />
            </ProtectedRoute>
          } />
          <Route path="/box/classes" element={
            <ProtectedRoute allowedRoles={['box_admin', 'trainer']}>
              <ClassManagement />
            </ProtectedRoute>
          } />
          <Route path="/box/reports" element={
            <ProtectedRoute allowedRoles={['box_admin']}>
              <Reports />
            </ProtectedRoute>
          } />
          <Route path="/box/crm" element={
            <ProtectedRoute allowedRoles={['box_admin']}>
              <BoxCRM />
            </ProtectedRoute>
          } />
          <Route path="/box/financial" element={
            <ProtectedRoute allowedRoles={['box_admin']}>
              <Financial />
            </ProtectedRoute>
          } />
          <Route path="/box/settings" element={
            <ProtectedRoute allowedRoles={['box_admin']}>
              <BoxSettings />
            </ProtectedRoute>
          } />

          {/* Student routes */}
          <Route path="/student" element={
            <ProtectedRoute allowedRoles={['student']}>
              <Navigate to="/student/dashboard" replace />
            </ProtectedRoute>
          } />
          <Route path="/student/dashboard" element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentDashboard />
            </ProtectedRoute>
          } />
          <Route path="/student/bookings" element={
            <ProtectedRoute allowedRoles={['student']}>
              <BookingManagement />
            </ProtectedRoute>
          } />
          <Route path="/student/progress" element={
            <ProtectedRoute allowedRoles={['student']}>
              <ProgressTracking />
            </ProtectedRoute>
          } />
          <Route path="/student/payments" element={
            <ProtectedRoute allowedRoles={['student']}>
              <PaymentManagement />
            </ProtectedRoute>
          } />

          {/* Trainer routes */}
          <Route path="/trainer" element={
            <ProtectedRoute allowedRoles={['trainer']}>
              <Navigate to="/trainer/dashboard" replace />
            </ProtectedRoute>
          } />
          <Route path="/trainer/dashboard" element={
            <ProtectedRoute allowedRoles={['trainer']}>
              <TrainerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/trainer/students" element={
            <ProtectedRoute allowedRoles={['trainer']}>
              <TrainerStudents />
            </ProtectedRoute>
          } />
          <Route path="/trainer/workouts" element={
            <ProtectedRoute allowedRoles={['trainer']}>
              <TrainerWorkoutPlans />
            </ProtectedRoute>
          } />
          <Route path="/trainer/nutrition" element={
            <ProtectedRoute allowedRoles={['trainer']}>
              <TrainerNutritionPlans />
            </ProtectedRoute>
          } />

          {/* Admin routes */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['cagio_admin']}>
              <Navigate to="/admin/dashboard" replace />
            </ProtectedRoute>
          } />
          <Route path="/admin/dashboard" element={
            <ProtectedRoute allowedRoles={['cagio_admin']}>
              <CagioAdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/boxes" element={
            <ProtectedRoute allowedRoles={['cagio_admin']}>
              <BoxManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute allowedRoles={['cagio_admin']}>
              <UserManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/onboarding" element={
            <ProtectedRoute allowedRoles={['cagio_admin']}>
              <BoxOnboarding />
            </ProtectedRoute>
          } />
          <Route path="/admin/reports" element={
            <ProtectedRoute allowedRoles={['cagio_admin']}>
              <AdminReports />
            </ProtectedRoute>
          } />

          {/* 404 route */}
          <Route path="*" element={<NotFound />} />
        </Routes>

        <Toaster />
      </div>
    </Router>
  );
};

const App: React.FC = () => {
  return <AppContent />;
};

export default App;
