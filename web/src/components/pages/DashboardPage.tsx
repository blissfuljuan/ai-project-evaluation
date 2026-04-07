import { useUser } from "@/context/UserContext";
import { APP_CONFIG } from "@/lib/app-config";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatCard } from "../dashboard/StatCard";
import { ModuleCard } from "../dashboard/ModuleCard";

export function DashboardPage() {
  const { user } = useUser();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <section className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome{user?.firstname ? `, ${user.firstname}` : ""}
        </h1>
        <p className="text-muted-foreground">
          Manage software projects, submissions, and evaluation workflows in{" "}
          {APP_CONFIG.appName}.
        </p>
      </section>

      {/* Quick Stats */}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Projects"
          value="0"
          description="Active software projects"
        />
        <StatCard
          title="Groups"
          value="0"
          description="Registered student groups"
        />
        <StatCard
          title="Submissions"
          value="0"
          description="Submitted project outputs"
        />
        <StatCard
          title="Evaluations"
          value="0"
          description="Completed evaluation records"
        />
      </section>

      {/* Module Overview */}
      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>System Overview</CardTitle>
            <CardDescription>
              Core academic workflow supported by the platform
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              The system supports project organization, submission management,
              and AI-assisted evaluation for software development courses.
            </p>
            <p>
              Use the sidebar to access modules for projects, groups,
              submissions, evaluations, and profile management.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Account</CardTitle>
            <CardDescription>Current signed-in user details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div>
              <span className="font-medium">Name:</span>{" "}
              {user
                ? `${user.firstname ?? ""} ${user.lastname ?? ""}`.trim()
                : "N/A"}
            </div>
            <div>
              <span className="font-medium">Email:</span> {user?.email ?? "N/A"}
            </div>
            <div>
              <span className="font-medium">Role:</span> {user?.role ?? "N/A"}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Quick Actions / Module Guide */}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <ModuleCard
          title="Projects"
          description="Manage software project records and project details."
        />
        <ModuleCard
          title="Groups"
          description="Organize student teams and associate them with projects."
        />
        <ModuleCard
          title="Submissions"
          description="Track and review submitted deliverables and outputs."
        />
        <ModuleCard
          title="Evaluations"
          description="Access evaluation records and AI-assisted assessment results."
        />
        <ModuleCard
          title="Profile"
          description="View your account information and update personal details."
        />
      </section>
    </div>
  );
}
