import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AuthProvider, ProtectedRoute } from '@/contexts/AuthContext';
import Landing from '@/pages/Landing';
import Login from '@/pages/auth/Login';
import BoxRegister from '@/pages/auth/BoxRegister';
import StudentRegister from '@/pages/auth/StudentRegister';
import CagioAdminDashboard from '@/pages/cagio/CagioAdminDashboard';
import BoxOnboarding from '@/pages/cagio/BoxOnboarding';
import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';
import { BoxDashboard } from '@/pages/box/BoxDashboard';
import { AthleteManagement } from '@/pages/box/AthleteManagement';
import { TrainerManagement } from '@/pages/box/TrainerManagement';

function App() {
  return (
    <Router>
      <LanguageProvider>
        <ThemeProvider>
          <AuthProvider>
            <div className="min-h-screen bg-background">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Landing />} />
                <Route path="/auth/login" element={<Login />} />
                <Route path="/auth/box-register" element={<BoxRegister />} />
                <Route path="/auth/student-register" element={<StudentRegister />} />

                {/* Protected Routes - Cagio Admin */}
                <Route 
                  path="/admin/dashboard" 
                  element={
                    <ProtectedRoute allowedRoles={['cagio_admin']}>
                      <CagioAdminDashboard />
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

                {/* Protected Routes - BOX Admin */}
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

                {/* Fallback Routes */}
                <Route path="/home" element={<Index />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </AuthProvider>
        </ThemeProvider>
      </LanguageProvider>
    </Router>
  );
}

export default App;
