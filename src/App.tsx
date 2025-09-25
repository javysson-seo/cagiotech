import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { CompanyProvider } from "@/contexts/CompanyContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { MobileAdminRedirect } from "@/components/MobileAdminRedirect";

// Pages
import Index from "./pages/Index";
import { LandingPage } from "./pages/LandingPage";
import { Landing } from "./pages/Landing";
import { Login } from "./pages/auth/Login";
import { LoginPage } from "./pages/auth/LoginPage";
import { BoxRegister } from "./pages/auth/BoxRegister";
import { StudentRegister } from "./pages/auth/StudentRegister";
import { EmailVerification } from "./pages/auth/EmailVerification";
import NotFound from "./pages/NotFound";

// Admin Pages
import { CagioAdminDashboard } from "./pages/admin/CagioAdminDashboard";
import { BoxManagement } from "./pages/admin/BoxManagement";
import { UserManagement } from "./pages/admin/UserManagement";
import { BoxOnboarding } from "./pages/admin/BoxOnboarding";
import { Reports as AdminReports } from "./pages/admin/Reports";

// Box Pages
import { BoxDashboard } from "./pages/box/BoxDashboard";
import { AthleteManagement } from "./pages/box/AthleteManagement";
import { HumanResources } from "./pages/box/HumanResources";
import { TrainerManagement } from "./pages/box/TrainerManagement";
import { ClassManagement } from "./pages/box/ClassManagement";
import { BoxSettings } from "./pages/box/BoxSettings";
import { Reports as BoxReports } from "./pages/box/Reports";
import { BoxCRM } from "./pages/box/BoxCRM";
import { BoxCommunication } from "./pages/box/BoxCommunication";
import { BoxEquipment } from "./pages/box/BoxEquipment";
import { BoxObservatory } from "./pages/box/BoxObservatory";
import { BoxKPIs } from "./pages/box/BoxKPIs";
import { Financial } from "./pages/box/Financial";

// Student Pages
import { StudentDashboard } from "./pages/student/StudentDashboard";
import { BookingManagement } from "./pages/student/BookingManagement";
import { ProgressTracking } from "./pages/student/ProgressTracking";
import { PaymentManagement } from "./pages/student/PaymentManagement";

// Trainer Pages
import { TrainerDashboard } from "./pages/trainer/TrainerDashboard";
import { TrainerStudents } from "./pages/trainer/TrainerStudents";
import { TrainerWorkoutPlans } from "./pages/trainer/TrainerWorkoutPlans";
import { TrainerNutritionPlans } from "./pages/trainer/TrainerNutritionPlans";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <ThemeProvider>
            <LanguageProvider>
              <TooltipProvider>
                <Toaster />
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/old-landing" element={<Landing />} />
                  <Route path="/auth/login" element={<LoginPage />} />
                  <Route path="/auth/box-register" element={<BoxRegister />} />
                  <Route path="/auth/student-register" element={<StudentRegister />} />
                  <Route path="/auth/email-verification" element={<EmailVerification />} />

                  {/* Admin Routes */}
                  <Route path="/admin" element={<ProtectedRoute allowedRoles={["cagio_admin"]}><MobileAdminRedirect><CagioAdminDashboard /></MobileAdminRedirect></ProtectedRoute>} />
                  <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={["cagio_admin"]}><MobileAdminRedirect><CagioAdminDashboard /></MobileAdminRedirect></ProtectedRoute>} />
                  <Route path="/admin/boxes" element={<ProtectedRoute allowedRoles={["cagio_admin"]}><MobileAdminRedirect><BoxManagement /></MobileAdminRedirect></ProtectedRoute>} />
                  <Route path="/admin/users" element={<ProtectedRoute allowedRoles={["cagio_admin"]}><MobileAdminRedirect><UserManagement /></MobileAdminRedirect></ProtectedRoute>} />
                  <Route path="/admin/boxes/onboard" element={<ProtectedRoute allowedRoles={["cagio_admin"]}><MobileAdminRedirect><BoxOnboarding /></MobileAdminRedirect></ProtectedRoute>} />
                  <Route path="/admin/reports" element={<ProtectedRoute allowedRoles={["cagio_admin"]}><MobileAdminRedirect><AdminReports /></MobileAdminRedirect></ProtectedRoute>} />

                  {/* Company-specific Routes */}
                  <Route path="/:companySlug" element={
                    <ProtectedRoute allowedRoles={["box_admin", "trainer"]}>
                      <CompanyProvider>
                        <BoxDashboard />
                      </CompanyProvider>
                    </ProtectedRoute>
                  } />
                  <Route path="/:companySlug/athletes" element={
                    <ProtectedRoute allowedRoles={["box_admin", "trainer"]}>
                      <CompanyProvider>
                        <AthleteManagement />
                      </CompanyProvider>
                    </ProtectedRoute>
                  } />
                  <Route path="/:companySlug/hr" element={
                    <ProtectedRoute allowedRoles={["box_admin"]}>
                      <CompanyProvider>
                        <HumanResources />
                      </CompanyProvider>
                    </ProtectedRoute>
                  } />
                  <Route path="/:companySlug/trainers" element={
                    <ProtectedRoute allowedRoles={["box_admin"]}>
                      <CompanyProvider>
                        <TrainerManagement />
                      </CompanyProvider>
                    </ProtectedRoute>
                  } />
                  <Route path="/:companySlug/classes" element={
                    <ProtectedRoute allowedRoles={["box_admin", "trainer"]}>
                      <CompanyProvider>
                        <ClassManagement />
                      </CompanyProvider>
                    </ProtectedRoute>
                  } />
                  <Route path="/:companySlug/settings" element={
                    <ProtectedRoute allowedRoles={["box_admin"]}>
                      <CompanyProvider>
                        <BoxSettings />
                      </CompanyProvider>
                    </ProtectedRoute>
                  } />
                  <Route path="/:companySlug/reports" element={
                    <ProtectedRoute allowedRoles={["box_admin", "trainer"]}>
                      <CompanyProvider>
                        <BoxReports />
                      </CompanyProvider>
                    </ProtectedRoute>
                  } />
                  <Route path="/:companySlug/crm" element={
                    <ProtectedRoute allowedRoles={["box_admin"]}>
                      <CompanyProvider>
                        <BoxCRM />
                      </CompanyProvider>
                    </ProtectedRoute>
                  } />
                  <Route path="/:companySlug/communication" element={
                    <ProtectedRoute allowedRoles={["box_admin", "trainer"]}>
                      <CompanyProvider>
                        <BoxCommunication />
                      </CompanyProvider>
                    </ProtectedRoute>
                  } />
                  <Route path="/:companySlug/financial" element={
                    <ProtectedRoute allowedRoles={["box_admin"]}>
                      <CompanyProvider>
                        <Financial />
                      </CompanyProvider>
                    </ProtectedRoute>
                  } />
                  <Route path="/:companySlug/equipment" element={
                    <ProtectedRoute allowedRoles={["box_admin", "trainer"]}>
                      <CompanyProvider>
                        <BoxEquipment />
                      </CompanyProvider>
                    </ProtectedRoute>
                  } />
                  <Route path="/:companySlug/observatory" element={
                    <ProtectedRoute allowedRoles={["box_admin"]}>
                      <CompanyProvider>
                        <BoxObservatory />
                      </CompanyProvider>
                    </ProtectedRoute>
                  } />
                  <Route path="/:companySlug/kpis" element={
                    <ProtectedRoute allowedRoles={["box_admin"]}>
                      <CompanyProvider>
                        <BoxKPIs />
                      </CompanyProvider>
                    </ProtectedRoute>
                  } />

                  {/* Student Routes */}
                  <Route path="/student" element={<ProtectedRoute allowedRoles={["student"]}><StudentDashboard /></ProtectedRoute>} />
                  <Route path="/student/bookings" element={<ProtectedRoute allowedRoles={["student"]}><BookingManagement /></ProtectedRoute>} />
                  <Route path="/student/progress" element={<ProtectedRoute allowedRoles={["student"]}><ProgressTracking /></ProtectedRoute>} />
                  <Route path="/student/payments" element={<ProtectedRoute allowedRoles={["student"]}><PaymentManagement /></ProtectedRoute>} />

                  {/* Trainer Routes */}
                  <Route path="/trainer" element={<ProtectedRoute allowedRoles={["trainer"]}><TrainerDashboard /></ProtectedRoute>} />
                  <Route path="/trainer/students" element={<ProtectedRoute allowedRoles={["trainer"]}><TrainerStudents /></ProtectedRoute>} />
                  <Route path="/trainer/workouts" element={<ProtectedRoute allowedRoles={["trainer"]}><TrainerWorkoutPlans /></ProtectedRoute>} />
                  <Route path="/trainer/nutrition" element={<ProtectedRoute allowedRoles={["trainer"]}><TrainerNutritionPlans /></ProtectedRoute>} />

                  {/* Fallback */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </TooltipProvider>
            </LanguageProvider>
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
