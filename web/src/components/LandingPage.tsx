import { useState } from "react";
import { Button } from "./ui/button";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";

type View = "login" | "register";

export function LandingPage() {
  const [view, setView] = useState<View>("login");

  return (
    <div className="min-h-screen bg-muted grid grid-cols-1 md:grid-cols-2">
      <div
        className="flex flex-col justify-center px-6 py-12 md:px-12 bg-background
                            md:bg-linear-to-br md:from-background md:to-muted"
      >
        <div className="max-w-md space-y-4">
          <h1 className="text-4xl font-bold leading-tight">
            Welcome to this Mini App
          </h1>
          <p className="text-muted-foreground text-lg">
            Securely manage your account, access exclusive features, and get
            started in minutes.
          </p>

          <div className="flex justify-center gap-3 pt-4">
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
