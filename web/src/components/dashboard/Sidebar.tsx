import type { ReactNode } from "react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import type { Page } from "./DashboardLayout";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";

interface SidebarProps {
  page: Page;
  onNavigate: (page: Page) => void;
}

export function Sidebar({ page, onNavigate }: SidebarProps) {
  const navigate = useNavigate();
  const { logout } = useUser();

  const handleLogout = async () => {
    logout();
    navigate("/");
  };

  return (
    <aside className="w-56 bg-background border-r p-4 flex flex-col">
      <nav className="space-y-1">
        <SidebarButton
          active={page === "dashboard"}
          onClick={() => onNavigate("dashboard")}
        >
          Dashboard
        </SidebarButton>

        <SidebarButton
          active={page === "profile"}
          onClick={() => onNavigate("profile")}
        >
          Profile
        </SidebarButton>

        <Separator className="my-4" />

        <SidebarButton onClick={handleLogout}>Logout</SidebarButton>
      </nav>
    </aside>
  );
}

function SidebarButton({
  active,
  destructive,
  children,
  onClick,
}: {
  active?: boolean;
  destructive?: boolean;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <Button
      variant={destructive ? "ghost" : active ? "secondary" : "ghost"}
      className={`w-full justify-start ${
        destructive ? "text-destructive hover:text-destructive" : ""
      }`}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}
