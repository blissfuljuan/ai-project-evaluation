import { TopBanner } from "./TopBanner";
import { Sidebar } from "./Sidebar";
import { Footer } from "./Footer";
import { Outlet } from "react-router";

export function DashboardLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-muted">
      <TopBanner />

      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
}
