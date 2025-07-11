
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";
import UserDashboard from "./pages/UserDashboard";
import BookParking from "./pages/BookParking";
import ActiveReservations from "./pages/ActiveReservations";
import BookingHistory from "./pages/BookingHistory";
import AdminDashboard from "./pages/AdminDashboard";
import CreatePlot from "./pages/CreatePlot";
import ViewAllPlots from "./pages/ViewAllPlots";
import ViewAllReservations from "./pages/ViewAllReservations";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import AppLayout from "./components/layout/AppLayout";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public routes */}
      <Route 
        path="/" 
        element={user ? <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'} replace /> : <Index />} 
      />
      <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" replace />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Protected User routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute requiredRole="user">
          <AppLayout>
            <UserDashboard />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/book-parking" element={
        <ProtectedRoute requiredRole="user">
          <AppLayout>
            <BookParking />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/active-reservations" element={
        <ProtectedRoute requiredRole="user">
          <AppLayout>
            <ActiveReservations />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/booking-history" element={
        <ProtectedRoute requiredRole="user">
          <AppLayout>
            <BookingHistory />
          </AppLayout>
        </ProtectedRoute>
      } />

      {/* Protected Admin routes */}
      <Route path="/admin/dashboard" element={
        <ProtectedRoute requiredRole="admin">
          <AppLayout>
            <AdminDashboard />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/admin/create-plot" element={
        <ProtectedRoute requiredRole="admin">
          <AppLayout>
            <CreatePlot />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/admin/plots" element={
        <ProtectedRoute requiredRole="admin">
          <AppLayout>
            <ViewAllPlots />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/admin/reservations" element={
        <ProtectedRoute requiredRole="admin">
          <AppLayout>
            <ViewAllReservations />
          </AppLayout>
        </ProtectedRoute>
      } />

      {/* Catch-all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;