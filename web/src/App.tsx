import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import "./App.css";
import { DashboardLayout } from "./components/dashboard/DashboardLayout";
import { LandingPage } from "./components/LandingPage";
import { RequireAuth } from "./auth/RequireAuth";
import { DashboardPage } from "./components/pages/DashboardPage";
import { ClassesPage } from "./components/pages/ClassesPage";
import { ProjectsPage } from "./components/pages/ProjectsPage";
import { CreateProjectPage } from "./components/pages/CreateProjectPage";
import { GroupsPage } from "./components/pages/GroupsPage";
import SubmissionsPage from "./components/pages/SubmissionsPage";
import EvaluationsPage from "./components/pages/EvaluationsPage";
import { ProfilePage } from "./components/pages/ProfilePage";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./components/ui/dialog";
import { Button } from "./components/ui/button";
import {
  resetSessionExpiredNotification,
  SESSION_EXPIRED_EVENT,
} from "./auth/session-expiry";
import { useUser } from "./context/UserContext";

function App() {
  const navigate = useNavigate();
  const { expireSession } = useUser();
  const [sessionExpiredMessage, setSessionExpiredMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleSessionExpired = (event: Event) => {
      const customEvent = event as CustomEvent<{ message: string }>;
      setSessionExpiredMessage(
        customEvent.detail?.message || "Session expired. Please log in again."
      );
    };

    window.addEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired);

    return () => {
      window.removeEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired);
    };
  }, []);

  const acknowledgeSessionExpiry = () => {
    expireSession(sessionExpiredMessage || "Session expired. Please log in again.");
    setSessionExpiredMessage(null);
    resetSessionExpiredNotification();
    navigate("/login", { replace: true });
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LandingPage />} />
        <Route path="/register" element={<LandingPage />} />

        <Route
          path="/app"
          element={
            <RequireAuth>
              <DashboardLayout />
            </RequireAuth>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="classes" element={<ClassesPage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="projects/create" element={<CreateProjectPage />} />
          <Route path="groups" element={<GroupsPage />} />
          <Route path="submissions" element={<SubmissionsPage />} />
          <Route path="evaluations" element={<EvaluationsPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Dialog open={!!sessionExpiredMessage}>
        <DialogContent
          showCloseButton={false}
          onInteractOutside={(event) => event.preventDefault()}
          onEscapeKeyDown={(event) => event.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Session expired</DialogTitle>
            <DialogDescription>
              {sessionExpiredMessage || "Session expired. Please log in again."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={acknowledgeSessionExpiry}>OK</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default App;
