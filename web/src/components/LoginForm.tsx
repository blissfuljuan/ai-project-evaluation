import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { useState, type SubmitEvent } from "react";
import { useUser } from "@/context/UserContext";
import { APP_CONFIG } from "@/lib/app-config";

export function LoginForm() {
  const navigate = useNavigate();
  const { login, error, clearError } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    clearError();
    setLoading(true);

    try {
      await login({ email, password });
      if (!error) navigate("/app/dashboard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="space-y-1">
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>
          Sign in to continue to {APP_CONFIG.appName}.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
