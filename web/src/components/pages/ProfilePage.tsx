import { useUser } from "@/context/UserContext";

export function ProfilePage() {
  const { user } = useUser();

  return (
    <div className="space-y-2 max-w-lg">
      <h2 className="text-2xl font-bold">Profile</h2>
      <p className="text-muted-foreground">
        Profile details will be shown here.
      </p>

      <div className="rounded-md border p-4 bg-background">
        <p>
          <strong>Name: </strong>
          {user?.lastname}, {user?.firstname}
        </p>
        <p>
          <strong>Email: </strong>
          {user?.email}
        </p>
      </div>
    </div>
  );
}
