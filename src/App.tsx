import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Landing } from "./pages/Landing";
import { Login } from "./pages/auth/Login";
import { BoxRegister } from "./pages/auth/BoxRegister";
import { StudentRegister } from "./pages/auth/StudentRegister";
import { CagioAdminDashboard } from "./pages/admin/CagioAdminDashboard";
import { BoxOnboarding } from "./pages/admin/BoxOnboarding";
import { BoxDashboard } from "./pages/box/BoxDashboard";
import { AthleteManagement } from "./pages/box/AthleteManagement";
import { ProtectedRoute } from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          
          {/* Auth Routes */}
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/box-login" element={<Login />} />
          <Route path="/auth/student-login" element={<Login />} />
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
            path="/admin/onboarding" 
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
            path="/box/onboarding" 
            element={
              <ProtectedRoute allowedRoles={['box_admin']}>
                <div className="min-h-screen flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">BOX Onboarding</h1>
                    <p className="text-muted-foreground">Complete a configuração da sua BOX</p>
                  </div>
                </div>
              </ProtectedRoute>
            } 
          />
          
          {/* BOX Features - Updated routes */}
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
                <div className="min-h-screen flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Gestão de Trainers</h1>
                    <p className="text-muted-foreground">Será implementado na Etapa 4</p>
                  </div>
                </div>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/box/classes" 
            element={
              <ProtectedRoute allowedRoles={['box_admin']}>
                <div className="min-h-screen flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Aulas & Serviços</h1>
                    <p className="text-muted-foreground">Será implementado na Etapa 5</p>
                  </div>
                </div>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/box/financial" 
            element={
              <ProtectedRoute allowedRoles={['box_admin']}>
                <div className="min-h-screen flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Gestão Financeira</h1>
                    <p className="text-muted-foreground">Será implementado na Etapa 6</p>
                  </div>
                </div>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/box/communication" 
            element={
              <ProtectedRoute allowedRoles={['box_admin']}>
                <div className="min-h-screen flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Comunicação</h1>
                    <p className="text-muted-foreground">Será implementado na Etapa 7</p>
                  </div>
                </div>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/box/settings" 
            element={
              <ProtectedRoute allowedRoles={['box_admin']}>
                <div className="min-h-screen flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Configurações</h1>
                    <p className="text-muted-foreground">Será implementado nas próximas etapas</p>
                  </div>
                </div>
              </ProtectedRoute>
            } 
          />
          
          {/* Other role routes remain the same */}
          <Route 
            path="/trainer/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['trainer']}>
                <div className="min-h-screen flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Trainer Dashboard</h1>
                    <p className="text-muted-foreground">Será implementado na Etapa 8</p>
                  </div>
                </div>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/student/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <div className="min-h-screen flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Student Dashboard</h1>
                    <p className="text-muted-foreground">Será implementado na Etapa 9</p>
                  </div>
                </div>
              </ProtectedRoute>
            } 
          />
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
