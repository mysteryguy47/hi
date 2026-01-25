import { Switch, Route } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ErrorBoundary from "./components/ErrorBoundary";
import Home from "./pages/Home";
import PaperCreate from "./pages/PaperCreate";
import PaperAttempt from "./pages/PaperAttempt";
import Mental from "./pages/Mental";
import NotFound from "./pages/NotFound";
import Login from "./components/Login";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import PromoteAdmin from "./pages/PromoteAdmin";
import StudentProfile from "./pages/StudentProfile";
import AdminAttendance from "./pages/AdminAttendance";
import AdminFeeManagement from "./pages/AdminFeeManagement";
import AbacusCourse from "./pages/AbacusCourse";
import VedicMathsCourse from "./pages/VedicMathsCourse";
import HandwritingCourse from "./pages/HandwritingCourse";
import STEMCourse from "./pages/STEMCourse";
import { ReactNode } from "react";
import { useScrollRestoration } from "./hooks/useScrollRestoration";
import { SpeedInsights } from "@vercel/speed-insights/react";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

function AdminRoute({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

function AppContent() {
  useScrollRestoration();

  return (
    <ErrorBoundary>
      <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
        <Header />
        <main className="flex-grow">
          <ErrorBoundary>
            <Switch>
              <Route path="/login" component={Login} />
              <Route path="/" component={Home} />
              <Route path="/create/junior" component={PaperCreate} />
              <Route path="/create/basic" component={PaperCreate} />
              <Route path="/create/advanced" component={PaperCreate} />
              <Route path="/create" component={PaperCreate} />
              <Route path="/vedic-maths/level-1" component={PaperCreate} />
              <Route path="/vedic-maths/level-2" component={PaperCreate} />
              <Route path="/vedic-maths/level-3" component={PaperCreate} />
              <Route path="/vedic-maths/level-4" component={PaperCreate} />
              <Route path="/mental">
                <ProtectedRoute>
                  <Mental />
                </ProtectedRoute>
              </Route>
              <Route path="/paper/attempt">
                <ProtectedRoute>
                  <ErrorBoundary>
                    <PaperAttempt />
                  </ErrorBoundary>
                </ProtectedRoute>
              </Route>
              <Route path="/dashboard">
                <ProtectedRoute>
                  <StudentDashboard />
                </ProtectedRoute>
              </Route>
              <Route path="/profile">
                <ProtectedRoute>
                  <StudentProfile />
                </ProtectedRoute>
              </Route>
              <Route path="/attendance">
                <ProtectedRoute>
                  <AdminAttendance />
                </ProtectedRoute>
              </Route>
              <Route path="/fees">
                <ProtectedRoute>
                  <AdminFeeManagement />
                </ProtectedRoute>
              </Route>
              <Route path="/admin">
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              </Route>
              <Route path="/admin/attendance">
                <AdminRoute>
                  <AdminAttendance />
                </AdminRoute>
              </Route>
              <Route path="/admin/fees">
                <AdminRoute>
                  <AdminFeeManagement />
                </AdminRoute>
              </Route>
              <Route path="/promote-admin">
                <ProtectedRoute>
                  <PromoteAdmin />
                </ProtectedRoute>
              </Route>
              <Route path="/courses/abacus" component={AbacusCourse} />
              <Route path="/courses/vedic-maths" component={VedicMathsCourse} />
              <Route
                path="/courses/handwriting"
                component={HandwritingCourse}
              />
              <Route path="/courses/stem" component={STEMCourse} />
              <Route component={NotFound} />
            </Switch>
          </ErrorBoundary>
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  );
}

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AppContent />
          <SpeedInsights />
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
