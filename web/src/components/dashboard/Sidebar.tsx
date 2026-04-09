import type { ReactNode } from "react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { NavLink, useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";

export function Sidebar() {
  const navigate = useNavigate();
  const { logout } = useUser();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <aside className="flex w-64 flex-col border-r bg-background p-4">
      <nav className="space-y-1">
        <SidebarLink to="/app/dashboard">Dashboard</SidebarLink>
        <SidebarLink to="/app/classes">Classes</SidebarLink>
        <SidebarLink to="/app/projects">Projects</SidebarLink>
        <SidebarLink to="/app/rubrics">Rubrics</SidebarLink>
        <SidebarLink to="/app/groups">Groups</SidebarLink>
        <SidebarLink to="/app/submissions">Submissions</SidebarLink>
        <SidebarLink to="/app/evaluations">Evaluations</SidebarLink>
        <SidebarLink to="/app/profile">Profile</SidebarLink>

        <Separator className="my-4" />

        <SidebarButton destructive onClick={handleLogout}>
          Logout
        </SidebarButton>
      </nav>
    </aside>
  );
}

function SidebarLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <NavLink to={to} className="block">
      {({ isActive }) => (
        <Button
          variant={isActive ? "secondary" : "ghost"}
          className="w-full justify-start"
        >
          {children}
        </Button>
      )}
    </NavLink>
  );
}

function SidebarButton({
  destructive,
  children,
  onClick,
}: {
  destructive?: boolean;
  children: ReactNode;
  onClick: () => void | Promise<void>;
}) {
  return (
    <Button
      variant="ghost"
      className={`w-full justify-start ${
        destructive ? "text-destructive hover:text-destructive" : ""
      }`}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}
