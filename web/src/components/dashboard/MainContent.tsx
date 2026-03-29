import type { Page } from "./DashboardLayout";
import { DashboardPage } from "../pages/DashboardPage";
import { ProfilePage } from "./../pages/ProfilePage";

interface MainContentProps {
  page: Page;
}

export function MainContent({ page }: MainContentProps) {
  return (
    <main className="flex-1 p-6">
      {page === "dashboard" && <DashboardPage />}
      {page === "profile" && <ProfilePage />}
    </main>
  );
}
