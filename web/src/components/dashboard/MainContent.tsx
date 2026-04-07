import { DashboardPage } from "../pages/DashboardPage";
import { ProfilePage } from "./../pages/ProfilePage";

type Page = "dashboard" | "profile";

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
