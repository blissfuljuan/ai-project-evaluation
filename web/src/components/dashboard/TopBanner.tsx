import { useUser } from "@/context/UserContext";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { APP_CONFIG } from "@/lib/app-config";

export function TopBanner() {
  const { user } = useUser();

  const initials = `${user?.firstname?.[0] ?? ""}${
    user?.lastname?.[0] ?? ""
  }`.toUpperCase();

  return (
    <header className="flex h-14 items-center justify-between border-b bg-background px-6">
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-semibold">{APP_CONFIG.shortName}</h1>

        <span className="hidden text-sm text-muted-foreground md:inline">
          {APP_CONFIG.appName}
        </span>
      </div>

      <div className="flex items-center gap-3">
        {user && (
          <span className="hidden text-sm text-muted-foreground md:inline">
            {user.firstname} {user.lastname}
          </span>
        )}

        <Avatar>
          <AvatarFallback>{initials || "U"}</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
