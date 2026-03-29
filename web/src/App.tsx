import { Routes, Route } from "react-router-dom";
import "./App.css";
import { DashboardLayout } from "./components/dashboard/DashboardLayout";
import { LandingPage } from "./components/LandingPage";
import { RequireAuth } from "./auth/RequireAuth";

function App() {
  return (
    // <DashboardLayout />
    <Routes>
      <Route path="/" element={<LandingPage />} />

      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <DashboardLayout />
          </RequireAuth>
        }
      />
    </Routes>
  );
}

export default App;
