import type { Page } from "./DashboardLayout";
import { DashboardHome } from "./../pages/DashboardHome"
import { ProfilePage } from "./../pages/ProfilePage"

interface MainContentProps {
    page: Page
}

export function MainContent({ page }: MainContentProps) {
    return (
        <main className="flex-1 p-6">
            {page === "dashboard" && <DashboardHome />}
            {page === "profile" && <ProfilePage />}
        </main>
    )
}