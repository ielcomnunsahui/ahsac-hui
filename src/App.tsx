import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import Index from "./pages/Index";
import About from "./pages/About";
import SDGs from "./pages/SDGs";
import Register from "./pages/Register";
import Feedback from "./pages/Feedback";
import Auth from "./pages/Auth";
import Dashboard from "./pages/admin/Dashboard";
import Members from "./pages/admin/Members";
import Faculties from "./pages/admin/Faculties";
import FeedbackAdmin from "./pages/admin/FeedbackAdmin";
import FoundingMembers from "./pages/admin/FoundingMembers";
import RegistrationLinks from "./pages/admin/RegistrationLinks";
import Settings from "./pages/admin/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/sdgs" element={<SDGs />} />
              <Route path="/register" element={<Register />} />
              <Route path="/feedback" element={<Feedback />} />
              <Route path="/auth" element={<Auth />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/admin/members" element={<ProtectedRoute><Members /></ProtectedRoute>} />
              <Route path="/admin/faculties" element={<ProtectedRoute><Faculties /></ProtectedRoute>} />
              <Route path="/admin/feedback" element={<ProtectedRoute><FeedbackAdmin /></ProtectedRoute>} />
              <Route path="/admin/founding-members" element={<ProtectedRoute><FoundingMembers /></ProtectedRoute>} />
              <Route path="/admin/registration-links" element={<ProtectedRoute><RegistrationLinks /></ProtectedRoute>} />
              <Route path="/admin/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
