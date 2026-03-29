import { useState } from "react";
import { Button } from "./ui/button";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import { APP_CONFIG } from "@/lib/app-config";

type View = "login" | "register";

export function LandingPage() {
  const [view, setView] = useState<View>("login");

  return (
    <div className="grid min-h-screen grid-cols-1 bg-muted md:grid-cols-2">
      <div
        className="flex flex-col justify-center bg-background px-6 py-12
                  md:bg-linear-to-br md:from-background md:to-muted md:px-12"
      >
        <div className="max-w-md space-y-5">
          <div className="space-y-2">
            <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
              {APP_CONFIG.shortName}
            </p>
            <h1 className="text-4xl font-bold leading-tight">
              {APP_CONFIG.appName}
            </h1>
            <p className="text-muted-foreground text-lg">
              {APP_CONFIG.description}
            </p>
          </div>

          <div className="flex gap-3 pt-2 justify-center">
            <Button
              variant={view === "login" ? "default" : "outline"}
              onClick={() => setView("login")}
            >
              Login
            </Button>

            <Button
              variant={view === "register" ? "default" : "outline"}
              onClick={() => setView("register")}
            >
              Register
            </Button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center px-4 py-12">
        {view === "login" ? <LoginForm /> : <RegisterForm />}
      </div>
    </div>
  );
}
