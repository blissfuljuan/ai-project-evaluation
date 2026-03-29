import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import { DashboardLayout } from "./components/dashboard/DashboardLayout";
import { LandingPage } from "./components/LandingPage";
import { RequireAuth } from "./auth/RequireAuth";
import { DashboardPage } from "./components/pages/DashboardPage";
import { ProjectsPage } from "./components/pages/ProjectsPage";
import { GroupsPage } from "./components/pages/GroupsPage";
import SubmissionsPage from "./components/pages/SubmissionsPage";
import EvaluationsPage from "./components/pages/EvaluationsPage";
import { ProfilePage } from "./components/pages/ProfilePage";

function App() {
  return (
    // <DashboardLayout />
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
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="groups" element={<GroupsPage />} />
        <Route path="submissions" element={<SubmissionsPage />} />
        <Route path="evaluations" element={<EvaluationsPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
