import { Suspense, lazy } from "react";
import {
  useRoutes,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Home from "./components/home";
import LandingPage from "./components/LandingPage";
import ResourcesPage from "./components/ResourcesPage";
import routes from "tempo-routes";
import { AuthProvider } from "./lib/auth";
import ErrorBoundary from "./components/ErrorBoundary";
import { ToastProvider } from "./components/Toast";
import AdminRoute from "./components/admin/AdminRoute";
import { AnimatePresence, motion } from "framer-motion";

// Lazy load admin components
const QuestionManager = lazy(
  () => import("./components/admin/QuestionManager"),
);

// Animation variants for page transitions
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  in: {
    opacity: 1,
    y: 0,
  },
  out: {
    opacity: 0,
    y: -20,
  },
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5,
};

const AnimatedRoute = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial="initial"
    animate="in"
    exit="out"
    variants={pageVariants}
    transition={pageTransition}
    className="w-full h-full"
  >
    {children}
  </motion.div>
);

function App() {
  const location = useLocation();

  return (
    <ErrorBoundary>
      <ToastProvider>
        <AuthProvider>
          <Suspense
            fallback={
              <div className="flex items-center justify-center min-h-screen bg-navy text-white">
                Loading...
              </div>
            }
          >
            <>
              <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>
                  <Route
                    path="/"
                    element={
                      <AnimatedRoute>
                        <LandingPage />
                      </AnimatedRoute>
                    }
                  />
                  <Route
                    path="/app"
                    element={
                      <AnimatedRoute>
                        <Home />
                      </AnimatedRoute>
                    }
                  />
                  <Route
                    path="/resources"
                    element={
                      <AnimatedRoute>
                        <ResourcesPage />
                      </AnimatedRoute>
                    }
                  />
                  <Route path="/login" element={<Navigate to="/app" />} />
                  <Route path="/signup" element={<Navigate to="/app" />} />
                  {/* Catch-all route to handle OAuth redirects */}
                  <Route path="*" element={<Navigate to="/app" />} />
                  <Route
                    path="/admin"
                    element={
                      <AdminRoute>
                        <AnimatedRoute>
                          <QuestionManager />
                        </AnimatedRoute>
                      </AdminRoute>
                    }
                  />
                </Routes>
              </AnimatePresence>
              {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
            </>
          </Suspense>
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
