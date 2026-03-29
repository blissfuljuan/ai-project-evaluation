import { useState } from "react"
import { TopBanner } from "./TopBanner"
import { Sidebar } from "./Sidebar"
import { MainContent } from "./MainContent"
import { Footer } from "./Footer"


export type Page = "dashboard" | "profile"

export function DashboardLayout() {
    const [page, setPage] = useState<Page>("dashboard")

    return (
        <div className="min-h-screen flex flex-col bg-muted">
            <TopBanner />

            <div className="flex flex-1">
                <Sidebar page={page} onNavigate={setPage} />
                <MainContent page={page} />
            </div>

            <Footer />
        </div>
    )
}