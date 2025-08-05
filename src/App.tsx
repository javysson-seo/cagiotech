import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'sonner';
import { ThemeProvider } from "@/components/ui/theme-provider"

// Import pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import BoxRegister from './pages/BoxRegister';
import StudentRegister from './pages/StudentRegister';
import NotFound from './pages/NotFound';

// Admin Pages
import CagioAdminDashboard from './pages/admin/CagioAdminDashboard';
import BoxManagement from './pages/admin/BoxManagement';
import BoxOnboarding from './pages/admin/BoxOnboarding';
import UserManagement from './pages/admin/UserManagement';
import Reports from './pages/admin/Reports';
import SystemSettings from './pages/admin/SystemSettings';

// Box Pages
import BoxDashboard from './pages/box/BoxDashboard';
import AthleteManagement from './pages/box/AthleteManagement';
import TrainerManagement from './pages/box/TrainerManagement';
import ClassManagement from './pages/box/ClassManagement';
import FinancialManagement from './pages/box/FinancialManagement';
import CommunicationCenter from './pages/box/CommunicationCenter';
import BoxSettings from './pages/box/BoxSettings';
import BoxCRM from './pages/box/BoxCRM';

// Trainer Pages
import TrainerDashboard from './pages/trainer/TrainerDashboard';
import TrainerSchedule from './pages/trainer/TrainerSchedule';
import TrainerStudents from './pages/trainer/TrainerStudents';
import TrainerWorkoutPlans from './pages/trainer/TrainerWorkoutPlans';
import TrainerNutritionPlans from './pages/trainer/TrainerNutritionPlans';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import BookingManagement from './pages/student/BookingManagement';
import ProgressTracking from './pages/student/ProgressTracking';
import PaymentManagement from './pages/student/PaymentManagement';

// Contexts
import { AuthProvider, useAuth, UserRole } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';

// Components
import { MembersDocuments } from '@/pages/box/MembersDocuments';
import { MembershipPlans } from '@/pages/box/MembershipPlans';

const queryClient = new QueryClient();

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <div>Unauthorized</div>;
  }

  return <>{children}</>;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <LanguageProvider>
            <ThemeProvider defaultTheme="light" storageKey="cagiotech-ui-theme">
              <Toaster />
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register/box" element={<BoxRegister />} />
                <Route path="/register/student" element={<StudentRegister />} />
                
                {/* Admin Routes */}
                <Route 
                  path="/admin/dashboard" 
                  element={
                    <ProtectedRoute requiredRole="cagio_admin">
                      <CagioAdminDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/boxes" 
                  element={
                    <ProtectedRoute requiredRole="cagio_admin">
                      <BoxManagement />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/boxes/new" 
                  element={
                    <ProtectedRoute requiredRole="cagio_admin">
                      <BoxOnboarding />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/users" 
                  element={
                    <ProtectedRoute requiredRole="cagio_admin">
                      <UserManagement />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/reports" 
                  element={
                    <ProtectedRoute requiredRole="cagio_admin">
                      <Reports />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/settings" 
                  element={
                    <ProtectedRoute requiredRole="cagio_admin">
                      <SystemSettings />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Box Routes */}
                <Route 
                  path="/box/dashboard" 
                  element={
                    <ProtectedRoute requiredRole="box_admin">
                      <BoxDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/box/athletes" 
                  element={
                    <ProtectedRoute requiredRole="box_admin">
                      <AthleteManagement />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/box/trainers" 
                  element={
                    <ProtectedRoute requiredRole="box_admin">
                      <TrainerManagement />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/box/classes" 
                  element={
                    <ProtectedRoute requiredRole="box_admin">
                      <ClassManagement />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/box/documents" 
                  element={
                    <ProtectedRoute requiredRole="box_admin">
                      <MembersDocuments />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/box/plans" 
                  element={
                    <ProtectedRoute requiredRole="box_admin">
                      <MembershipPlans />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/box/financial" 
                  element={
                    <ProtectedRoute requiredRole="box_admin">
                      <FinancialManagement />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/box/communication" 
                  element={
                    <ProtectedRoute requiredRole="box_admin">
                      <CommunicationCenter />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/box/settings" 
                  element={
                    <ProtectedRoute requiredRole="box_admin">
                      <BoxSettings />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/box/crm" 
                  element={
                    <ProtectedRoute requiredRole="box_admin">
                      <BoxCRM />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/box/reports" 
                  element={
                    <ProtectedRoute requiredRole="box_admin">
                      <Reports />
                    </ProtectedRoute>
                  } 
                />

                {/* Trainer Routes */}
                <Route 
                  path="/trainer/dashboard" 
                  element={
                    <ProtectedRoute requiredRole="trainer">
                      <TrainerDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/trainer/schedule" 
                  element={
                    <ProtectedRoute requiredRole="trainer">
                      <TrainerSchedule />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/trainer/students" 
                  element={
                    <ProtectedRoute requiredRole="trainer">
                      <TrainerStudents />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/trainer/workouts" 
                  element={
                    <ProtectedRoute requiredRole="trainer">
                      <TrainerWorkoutPlans />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/trainer/nutrition" 
                  element={
                    <ProtectedRoute requiredRole="trainer">
                      <TrainerNutritionPlans />
                    </ProtectedRoute>
                  } 
                />

                {/* Student Routes */}
                <Route 
                  path="/student/dashboard" 
                  element={
                    <ProtectedRoute requiredRole="student">
                      <StudentDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/student/bookings" 
                  element={
                    <ProtectedRoute requiredRole="student">
                      <BookingManagement />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/student/progress" 
                  element={
                    <ProtectedRoute requiredRole="student">
                      <ProgressTracking />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/student/payments" 
                  element={
                    <ProtectedRoute requiredRole="student">
                      <PaymentManagement />
                    </ProtectedRoute>
                  } 
                />

                {/* 404 Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </ThemeProvider>
          </LanguageProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
