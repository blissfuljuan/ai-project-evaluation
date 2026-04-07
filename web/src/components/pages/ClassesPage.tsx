import { useEffect, useState } from "react";

import { classApi } from "@/api/class.api";
import { ClassCard } from "@/components/classes/ClassCard";
import { ClassForm } from "@/components/classes/ClassForm";
import { Separator } from "@/components/ui/separator";
import { useUser } from "@/context/UserContext";
import type { CourseClass, CourseClassRequest } from "@/types/course-class";

export function ClassesPage() {
  const { user } = useUser();
  const [classes, setClasses] = useState<CourseClass[]>([]);
  const [editingClass, setEditingClass] = useState<CourseClass | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadClasses = async () => {
      try {
        const data = await classApi.listTeaching();
        setClasses(data);
      } catch (err: any) {
        const msg =
          err?.response?.data?.message || "Unable to load your classes.";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    loadClasses();
  }, []);

  const handleCreate = async (payload: CourseClassRequest) => {
    setSaving(true);
    try {
      const created = await classApi.create(payload);
      setClasses((current) => [created, ...current]);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (payload: CourseClassRequest) => {
    if (!editingClass) return;

    setSaving(true);
    try {
      const updated = await classApi.update(editingClass.id, payload);
      setClasses((current) =>
        current.map((item) => (item.id === updated.id ? updated : item))
      );
      setEditingClass(null);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (courseClass: CourseClass) => {
    setDeletingId(courseClass.id);
    setError(null);

    try {
      await classApi.remove(courseClass.id);
      setClasses((current) => current.filter((item) => item.id !== courseClass.id));
      if (editingClass?.id === courseClass.id) {
        setEditingClass(null);
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || "Unable to delete this class.";
      setError(msg);
    } finally {
      setDeletingId(null);
    }
  };

  const isTeacherView = user?.role === "INSTRUCTOR" || user?.role === "ADMIN";

  if (!isTeacherView) {
    return (
      <div className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight">Classes</h1>
        <p className="text-sm text-muted-foreground">
          Class management is available to instructors and administrators only.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Classes</h1>
        <p className="text-muted-foreground">
          Create and manage the course classes you teach.
        </p>
      </section>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <ClassForm saving={saving} onSubmit={handleCreate} />

      {editingClass && (
        <>
          <Separator />
          <ClassForm
            key={editingClass.id}
            initialValue={editingClass}
            saving={saving}
            onCancel={() => setEditingClass(null)}
            onSubmit={handleUpdate}
          />
        </>
      )}

      <Separator />

      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold">Your Classes</h2>
          <p className="text-sm text-muted-foreground">
            Manage class details before opening enrollment for students.
          </p>
        </div>

        {loading ? (
          <p className="text-sm text-muted-foreground">Loading classes...</p>
        ) : classes.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No classes yet. Create your first course class to begin.
          </p>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {classes.map((courseClass) => (
              <ClassCard
                key={courseClass.id}
                courseClass={courseClass}
                deleting={deletingId === courseClass.id}
                onEdit={setEditingClass}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
