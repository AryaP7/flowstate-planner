import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { AppProvider, useAppContext } from "./context/AppContext";
import { Sidebar } from "./components/layout/Sidebar";
import { Navbar } from "./components/layout/Navbar";
import Projects from "./pages/Projects";
import Tasks from "./pages/Tasks";
import Calendar from "./pages/Calendar";
import Focus from "./pages/Focus";
import Analytics from "./pages/Analytics";
import Auth from './pages/Auth';
import Landing from './pages/Landing';
import { useEffect } from "react";

const queryClient = new QueryClient();

// RequireAuth component
function RequireAuth({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAppContext();
  if (!currentUser) {
    return <Navigate to="/auth" replace />;
  }
  return <>{children}</>;
}

// ProtectedLayout: only show Sidebar/Navbar on protected pages
function ProtectedLayout() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

const App = () => {
  // Apply dark mode based on localStorage or system preference
  useEffect(() => {
    const theme = localStorage.getItem('theme');
    if (theme === 'light') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/login" element={<Navigate to="/auth" replace />} />
            <Route element={<ProtectedLayout />}>
              <Route path="/dashboard" element={<RequireAuth><Index /></RequireAuth>} />
              <Route path="/projects" element={<RequireAuth><Projects /></RequireAuth>} />
              <Route path="/tasks" element={<RequireAuth><Tasks /></RequireAuth>} />
              <Route path="/calendar" element={<RequireAuth><Calendar /></RequireAuth>} />
              <Route path="/focus" element={<RequireAuth><Focus /></RequireAuth>} />
              <Route path="/analytics" element={<RequireAuth><Analytics /></RequireAuth>} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </AppProvider>
    </QueryClientProvider>
  );
};

export default App;
