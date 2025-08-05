
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { Toaster } from '@/components/ui/sonner';
import { ProtectedRoute } from '@/components/ProtectedRoute';

// Pages
import { Landing } from '@/pages/Landing';
import { Login } from '@/pages/auth/Login';
import { BoxRegister } from '@/pages/auth/BoxRegister';
import { StudentRegister } from '@/pages/auth/StudentRegister';
import NotFound from '@/pages/NotFound';

// Admin Pages
import { CagioAdminDashboard } from '@/pages/admin/CagioAdminDashboard';
import { BoxManagement } from '@/pages/admin/BoxManagement';
import { UserManagement } from '@/pages/admin/UserManagement';
import { Reports } from '@/pages/admin/Reports';

// BOX Admin Pages
import { BoxDashboard } from '@/pages/box/BoxDashboard';
import { AthleteManagement } from '@/pages/box/AthleteManagement';
import { TrainerManagement } from '@/pages/box/TrainerManagement';
import { ClassManagement } from '@/pages/box/ClassManagement';
import { BoxReports } from '@/pages/box/Reports';
import { BoxCRM } from '@/pages/box/BoxCRM';

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

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <AuthProvider>
            <Router>
              <div className="min-h-screen bg-background text-foreground">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Landing />} />
                  <Route path="/auth/login" element={<Login />} />
                  <Route path="/auth/box-register" element={<BoxRegister />} />
                  <Route path="/auth/student-register" element={<StudentRegister />} />

                  {/* Admin Routes */}
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
                    path="/admin/reports" 
                    element={
                      <ProtectedRoute allowedRoles={['cagio_admin']}>
                        <Reports />
                      </ProtectedRoute>
                    } 
                  />

                  {/* BOX Admin Routes */}
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
                  <Route 
                    path="/box/crm" 
                    element={
                      <ProtectedRoute allowedRoles={['box_admin']}>
                        <BoxCRM />
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

                  {/* 404 */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
                
                <Toaster />
              </div>
            </Router>
          </AuthProvider>
        </ThemeProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
