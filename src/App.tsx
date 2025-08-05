
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { Landing } from '@/pages/Landing';
import { Login } from '@/pages/auth/Login';
import { BoxRegister } from '@/pages/auth/BoxRegister';
import { StudentRegister } from '@/pages/auth/StudentRegister';
import { BoxDashboard } from '@/pages/box/BoxDashboard';
import { AthleteManagement } from '@/pages/box/AthleteManagement';
import { TrainerManagement } from '@/pages/box/TrainerManagement';
import { ClassManagement } from '@/pages/box/ClassManagement';
import { StudentDashboard } from '@/pages/student/StudentDashboard';
import { BookingManagement } from '@/pages/student/BookingManagement';
import { PaymentManagement } from '@/pages/student/PaymentManagement';
import { ProgressTracking } from '@/pages/student/ProgressTracking';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/box-register" element={<BoxRegister />} />
              <Route path="/auth/student-register" element={<StudentRegister />} />
              
              {/* BOX Admin Routes */}
              <Route path="/box/dashboard" element={
                <ProtectedRoute allowedRoles={['box_admin']}>
                  <BoxDashboard />
                </ProtectedRoute>
              } />
              <Route path="/box/athletes" element={
                <ProtectedRoute allowedRoles={['box_admin']}>
                  <AthleteManagement />
                </ProtectedRoute>
              } />
              <Route path="/box/trainers" element={
                <ProtectedRoute allowedRoles={['box_admin']}>
                  <TrainerManagement />
                </ProtectedRoute>
              } />
              <Route path="/box/classes" element={
                <ProtectedRoute allowedRoles={['box_admin']}>
                  <ClassManagement />
                </ProtectedRoute>
              } />
              
              {/* Student Routes */}
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
              <Route path="/student/payments" element={
                <ProtectedRoute allowedRoles={['student']}>
                  <PaymentManagement />
                </ProtectedRoute>
              } />
              <Route path="/student/progress" element={
                <ProtectedRoute allowedRoles={['student']}>
                  <ProgressTracking />
                </ProtectedRoute>
              } />
              
              {/* Redirect unknown routes */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <Toaster />
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
