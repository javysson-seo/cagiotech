
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Existing imports
import { Landing } from '@/pages/Landing';
import { Login } from '@/pages/auth/Login';
import { BoxRegister } from '@/pages/auth/BoxRegister';
import { StudentRegister } from '@/pages/auth/StudentRegister';
import NotFound from '@/pages/NotFound';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { MobileAdminRedirect } from '@/components/MobileAdminRedirect';
import { Toaster } from '@/components/ui/sonner';

// Admin Pages
import { CagioAdminDashboard } from '@/pages/admin/CagioAdminDashboard';
import { BoxManagement } from '@/pages/admin/BoxManagement';
import { UserManagement } from '@/pages/admin/UserManagement';
import { BoxOnboarding } from '@/pages/admin/BoxOnboarding';
import { Reports } from '@/pages/admin/Reports';

// Box Admin Pages
import { BoxDashboard } from '@/pages/box/BoxDashboard';
import { AthleteManagement } from '@/pages/box/AthleteManagement';
import { TrainerManagement } from '@/pages/box/TrainerManagement';
import { ClassManagement } from '@/pages/box/ClassManagement';
import { Reports as BoxReports } from '@/pages/box/Reports';

// Trainer Pages
import { TrainerDashboard } from '@/pages/trainer/TrainerDashboard';
import { TrainerStudents } from '@/pages/trainer/TrainerStudents';
import { TrainerWorkoutPlans } from '@/pages/trainer/TrainerWorkoutPlans';
import { TrainerNutritionPlans } from '@/pages/trainer/TrainerNutritionPlans';

// Student Pages
import { StudentDashboard } from '@/pages/student/StudentDashboard';
import { BookingManagement } from '@/pages/student/BookingManagement';
import { ProgressTracking } from '@/pages/student/ProgressTracking';
import { PaymentManagement } from '@/pages/student/PaymentManagement';

function App() {
  return (
    <Router>
      <Routes>
        {/* Landing and Auth */}
        <Route path="/" element={<Landing />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/box-register" element={<BoxRegister />} />
        <Route path="/auth/student-register" element={<StudentRegister />} />
        
        {/* Cagio Admin Routes */}
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['cagio_admin']}>
              <CagioAdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/boxes" 
          element={
            <ProtectedRoute allowedRoles={['cagio_admin']}>
              <BoxManagement />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/users" 
          element={
            <ProtectedRoute allowedRoles={['cagio_admin']}>
              <UserManagement />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/box-onboarding" 
          element={
            <ProtectedRoute allowedRoles={['cagio_admin']}>
              <BoxOnboarding />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/reports" 
          element={
            <ProtectedRoute allowedRoles={['cagio_admin']}>
              <Reports />
            </ProtectedRoute>
          } 
        />

        {/* Box Admin Routes */}
        <Route 
          path="/box/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['box_admin']}>
              <BoxDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/box/athletes" 
          element={
            <ProtectedRoute allowedRoles={['box_admin']}>
              <AthleteManagement />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/box/trainers" 
          element={
            <ProtectedRoute allowedRoles={['box_admin']}>
              <TrainerManagement />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/box/classes" 
          element={
            <ProtectedRoute allowedRoles={['box_admin']}>
              <ClassManagement />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/box/reports" 
          element={
            <ProtectedRoute allowedRoles={['box_admin']}>
              <BoxReports />
            </ProtectedRoute>
          } 
        />

        {/* Trainer Routes */}
        <Route 
          path="/trainer/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['trainer']}>
              <TrainerDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/trainer/students" 
          element={
            <ProtectedRoute allowedRoles={['trainer']}>
              <TrainerStudents />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/trainer/workout-plans" 
          element={
            <ProtectedRoute allowedRoles={['trainer']}>
              <TrainerWorkoutPlans />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/trainer/nutrition-plans" 
          element={
            <ProtectedRoute allowedRoles={['trainer']}>
              <TrainerNutritionPlans />
            </ProtectedRoute>
          } 
        />

        {/* Student Routes */}
        <Route 
          path="/student/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/student/bookings" 
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <BookingManagement />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/student/progress" 
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <ProgressTracking />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/student/payments" 
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <PaymentManagement />
            </ProtectedRoute>
          } 
        />

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
      <MobileAdminRedirect />
    </Router>
  );
}

export default App;
