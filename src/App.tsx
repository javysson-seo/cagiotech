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
import { RoleBasedRedirect } from "./components/RoleBasedRedirect";

// Pages
import Index from "./pages/Index";
import { LandingPage } from "./pages/LandingPage";
import { Landing } from "./pages/Landing";
import { Login } from "./pages/auth/Login";
import { LoginPage } from "./pages/auth/LoginPage";
import { BoxRegister } from "./pages/auth/BoxRegister";
import { StudentRegister } from "./pages/auth/StudentRegister";
import { EmailVerification } from "./pages/auth/EmailVerification";
import { PublicAthleteRegister } from "./pages/auth/PublicAthleteRegister";
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
import { Financial } from "./pages/box/Financial";
import SubscriptionsManagement from "./pages/box/SubscriptionsManagement";

// Student Pages
import { StudentDashboard } from "./pages/student/StudentDashboard";
import { Workouts } from "./pages/student/Workouts";
import { BookingManagement } from "./pages/student/BookingManagement";
import { ProgressTracking } from "./pages/student/ProgressTracking";
import { PaymentManagement } from "./pages/student/PaymentManagement";

// Trainer Pages
import { TrainerDashboard } from "./pages/trainer/TrainerDashboard";
import { TrainerStudents } from "./pages/trainer/TrainerStudents";
import { TrainerWorkoutPlans } from "./pages/trainer/TrainerWorkoutPlans";
import { TrainerNutritionPlans } from "./pages/trainer/TrainerNutritionPlans";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

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
                  <Route path="/" element={<Landing />} />
                  <Route path="/old-landing" element={<Landing />} />
                  <Route path="/auth/login" element={<LoginPage />} />
                  <Route path="/auth/box-register" element={<BoxRegister />} />
                  <Route path="/auth/student-register" element={<StudentRegister />} />
                  <Route path="/auth/email-verification" element={<EmailVerification />} />
                  <Route path="/register/:companyId" element={<PublicAthleteRegister />} />

                  {/* Admin Routes */}
                  <Route path="/admin" element={<ProtectedRoute allowedRoles={["cagio_admin"]}><MobileAdminRedirect><CagioAdminDashboard /></MobileAdminRedirect></ProtectedRoute>} />
                  <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={["cagio_admin"]}><MobileAdminRedirect><CagioAdminDashboard /></MobileAdminRedirect></ProtectedRoute>} />
                  <Route path="/admin/boxes" element={<ProtectedRoute allowedRoles={["cagio_admin"]}><MobileAdminRedirect><BoxManagement /></MobileAdminRedirect></ProtectedRoute>} />
                  <Route path="/admin/users" element={<ProtectedRoute allowedRoles={["cagio_admin"]}><MobileAdminRedirect><UserManagement /></MobileAdminRedirect></ProtectedRoute>} />
                  <Route path="/admin/boxes/onboard" element={<ProtectedRoute allowedRoles={["cagio_admin"]}><MobileAdminRedirect><BoxOnboarding /></MobileAdminRedirect></ProtectedRoute>} />
                  <Route path="/admin/reports" element={<ProtectedRoute allowedRoles={["cagio_admin"]}><MobileAdminRedirect><AdminReports /></MobileAdminRedirect></ProtectedRoute>} />

                  {/* Company-specific Routes */}
                  <Route path="/:companyId" element={
                    <ProtectedRoute allowedRoles={["box_admin", "trainer"]}>
                      <CompanyProvider>
                        <BoxDashboard />
                      </CompanyProvider>
                    </ProtectedRoute>
                  } />
                  <Route path="/:companyId/athletes" element={
                    <ProtectedRoute allowedRoles={["box_admin", "trainer"]}>
                      <CompanyProvider>
                        <AthleteManagement />
                      </CompanyProvider>
                    </ProtectedRoute>
                  } />
                  <Route path="/:companyId/hr" element={
                    <ProtectedRoute allowedRoles={["box_admin"]}>
                      <CompanyProvider>
                        <HumanResources />
                      </CompanyProvider>
                    </ProtectedRoute>
                  } />
                  <Route path="/:companyId/trainers" element={
                    <ProtectedRoute allowedRoles={["box_admin"]}>
                      <CompanyProvider>
                        <TrainerManagement />
                      </CompanyProvider>
                    </ProtectedRoute>
                  } />
                  <Route path="/:companyId/classes" element={
                    <ProtectedRoute allowedRoles={["box_admin", "trainer"]}>
                      <CompanyProvider>
                        <ClassManagement />
                      </CompanyProvider>
                    </ProtectedRoute>
                  } />
                  <Route path="/:companyId/crm" element={
                    <ProtectedRoute allowedRoles={["box_admin", "trainer"]}>
                      <CompanyProvider>
                        <BoxCRM />
                      </CompanyProvider>
                    </ProtectedRoute>
                  } />
                  <Route path="/:companyId/communication" element={
                    <ProtectedRoute allowedRoles={["box_admin", "trainer"]}>
                      <CompanyProvider>
                        <BoxCommunication />
                      </CompanyProvider>
                    </ProtectedRoute>
                  } />
                  <Route path="/:companyId/financial" element={
                    <ProtectedRoute allowedRoles={["box_admin"]}>
                      <CompanyProvider>
                        <Financial />
                      </CompanyProvider>
                    </ProtectedRoute>
                  } />
                  <Route path="/:companyId/subscriptions" element={
                    <ProtectedRoute allowedRoles={["box_admin"]}>
                      <CompanyProvider>
                        <SubscriptionsManagement />
                      </CompanyProvider>
                    </ProtectedRoute>
                  } />
                  <Route path="/:companyId/equipment" element={
                    <ProtectedRoute allowedRoles={["box_admin", "trainer"]}>
                      <CompanyProvider>
                        <BoxEquipment />
                      </CompanyProvider>
                    </ProtectedRoute>
                  } />
                  <Route path="/:companyId/settings" element={
                    <ProtectedRoute allowedRoles={["box_admin"]}>
                      <CompanyProvider>
                        <BoxSettings />
                      </CompanyProvider>
                    </ProtectedRoute>
                  } />
                  <Route path="/:companyId/reports" element={
                    <ProtectedRoute allowedRoles={["box_admin"]}>
                      <CompanyProvider>
                        <BoxReports />
                      </CompanyProvider>
                    </ProtectedRoute>
                  } />

                  {/* Box Routes (without company slug for direct access) */}
                  <Route path="/box" element={
                    <ProtectedRoute allowedRoles={["box_admin", "trainer"]}>
                      <CompanyProvider>
                        <BoxDashboard />
                      </CompanyProvider>
                    </ProtectedRoute>
                  } />
                  <Route path="/box/dashboard" element={
                    <ProtectedRoute allowedRoles={["box_admin", "trainer"]}>
                      <CompanyProvider>
                        <BoxDashboard />
                      </CompanyProvider>
                    </ProtectedRoute>
                  } />
                  <Route path="/box/athletes" element={
                    <ProtectedRoute allowedRoles={["box_admin", "trainer"]}>
                      <CompanyProvider>
                        <AthleteManagement />
                      </CompanyProvider>
                    </ProtectedRoute>
                  } />
                  <Route path="/box/hr" element={
                    <ProtectedRoute allowedRoles={["box_admin"]}>
                      <CompanyProvider>
                        <HumanResources />
                      </CompanyProvider>
                    </ProtectedRoute>
                  } />
                  <Route path="/box/trainers" element={
                    <ProtectedRoute allowedRoles={["box_admin"]}>
                      <CompanyProvider>
                        <TrainerManagement />
                      </CompanyProvider>
                    </ProtectedRoute>
                  } />
                  <Route path="/box/classes" element={
                    <ProtectedRoute allowedRoles={["box_admin", "trainer"]}>
                      <CompanyProvider>
                        <ClassManagement />
                      </CompanyProvider>
                    </ProtectedRoute>
                  } />
                  <Route path="/box/settings" element={
                    <ProtectedRoute allowedRoles={["box_admin"]}>
                      <CompanyProvider>
                        <BoxSettings />
                      </CompanyProvider>
                    </ProtectedRoute>
                  } />
                  <Route path="/box/reports" element={
                    <ProtectedRoute allowedRoles={["box_admin"]}>
                      <CompanyProvider>
                        <BoxReports />
                      </CompanyProvider>
                    </ProtectedRoute>
                  } />
                  <Route path="/box/crm" element={
                    <ProtectedRoute allowedRoles={["box_admin", "trainer"]}>
                      <CompanyProvider>
                        <BoxCRM />
                      </CompanyProvider>
                    </ProtectedRoute>
                  } />
                  <Route path="/box/communication" element={
                    <ProtectedRoute allowedRoles={["box_admin", "trainer"]}>
                      <CompanyProvider>
                        <BoxCommunication />
                      </CompanyProvider>
                    </ProtectedRoute>
                  } />
                  <Route path="/box/equipment" element={
                    <ProtectedRoute allowedRoles={["box_admin", "trainer"]}>
                      <CompanyProvider>
                        <BoxEquipment />
                      </CompanyProvider>
                    </ProtectedRoute>
                  } />
                  <Route path="/box/financial" element={
                    <ProtectedRoute allowedRoles={["box_admin"]}>
                      <CompanyProvider>
                        <Financial />
                      </CompanyProvider>
                    </ProtectedRoute>
                  } />
                  <Route path="/box/subscriptions" element={
                    <ProtectedRoute allowedRoles={["box_admin"]}>
                      <CompanyProvider>
                        <SubscriptionsManagement />
                      </CompanyProvider>
                    </ProtectedRoute>
                  } />

                  {/* Student Routes */}
                  <Route path="/student" element={<ProtectedRoute allowedRoles={["student"]}><StudentDashboard /></ProtectedRoute>} />
                  <Route path="/student/dashboard" element={<ProtectedRoute allowedRoles={["student"]}><StudentDashboard /></ProtectedRoute>} />
                  <Route path="/student/workouts" element={<ProtectedRoute allowedRoles={["student"]}><Workouts /></ProtectedRoute>} />
                  <Route path="/student/bookings" element={<ProtectedRoute allowedRoles={["student"]}><BookingManagement /></ProtectedRoute>} />
                  <Route path="/student/progress" element={<ProtectedRoute allowedRoles={["student"]}><ProgressTracking /></ProtectedRoute>} />
                  <Route path="/student/payments" element={<ProtectedRoute allowedRoles={["student"]}><PaymentManagement /></ProtectedRoute>} />

                  {/* Trainer Routes - Accept both trainer role and box_admin for trainers */}
                  <Route path="/trainer" element={<ProtectedRoute allowedRoles={["trainer", "box_admin"]}><TrainerDashboard /></ProtectedRoute>} />
                  <Route path="/trainer/dashboard" element={<ProtectedRoute allowedRoles={["trainer", "box_admin"]}><TrainerDashboard /></ProtectedRoute>} />
                  <Route path="/trainer/students" element={<ProtectedRoute allowedRoles={["trainer", "box_admin"]}><TrainerStudents /></ProtectedRoute>} />
                  <Route path="/trainer/workout-plans" element={<ProtectedRoute allowedRoles={["trainer", "box_admin"]}><TrainerWorkoutPlans /></ProtectedRoute>} />
                  <Route path="/trainer/nutrition-plans" element={<ProtectedRoute allowedRoles={["trainer", "box_admin"]}><TrainerNutritionPlans /></ProtectedRoute>} />

                  {/* Landing Page */}
                  <Route path="/landing" element={<LandingPage />} />

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