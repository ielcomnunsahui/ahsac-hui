import { useState } from "react";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import { ScrollToTop } from "@/components/ScrollToTop";
import Index from "./pages/Index";
import About from "./pages/About";
import SDGs from "./pages/SDGs";
import Register from "./pages/Register";
import Feedback from "./pages/Feedback";
import Testimonials from "./pages/Testimonials";
import Auth from "./pages/Auth";
import MemberLogin from "./pages/MemberLogin";
import MemberDashboard from "./pages/MemberDashboard";
import PublicEvents from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import Dashboard from "./pages/admin/Dashboard";
import Members from "./pages/admin/Members";
import FeedbackAdmin from "./pages/admin/FeedbackAdmin";
import FoundingMembers from "./pages/admin/FoundingMembers";
import RegistrationLinks from "./pages/admin/RegistrationLinks";
import Settings from "./pages/admin/Settings";
import Analytics from "./pages/admin/Analytics";
import AcademicStructure from "./pages/admin/AcademicStructure";
import Alumni from "./pages/admin/Alumni";
import Events from "./pages/admin/Events";
import EventCheckIn from "./pages/admin/EventCheckIn";
import Resources from "./pages/Resources";
import Contact from "./pages/Contact";
import Team from "./pages/Team";
import NotFound from "./pages/NotFound";

const App = () => {
  const [queryClient] = useState(() => new QueryClient());

  return (
  <HelmetProvider>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/sdgs" element={<SDGs />} />
              <Route path="/events" element={<PublicEvents />} />
              <Route path="/events/:id" element={<EventDetails />} />
              <Route path="/register" element={<Register />} />
              <Route path="/feedback" element={<Feedback />} />
              <Route path="/testimonials" element={<Testimonials />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/member-login" element={<MemberLogin />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/team" element={<Team />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/member-dashboard" element={<MemberDashboard />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/admin/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
              <Route path="/admin/members" element={<ProtectedRoute><Members /></ProtectedRoute>} />
              <Route path="/admin/academic-structure" element={<ProtectedRoute><AcademicStructure /></ProtectedRoute>} />
              <Route path="/admin/alumni" element={<ProtectedRoute><Alumni /></ProtectedRoute>} />
              <Route path="/admin/events" element={<ProtectedRoute><Events /></ProtectedRoute>} />
              <Route path="/admin/event-check-in" element={<ProtectedRoute><EventCheckIn /></ProtectedRoute>} />
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
    </ThemeProvider>
  </HelmetProvider>
  );
};

export default App;
