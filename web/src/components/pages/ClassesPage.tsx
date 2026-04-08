import { useEffect, useMemo, useState } from "react";

import { classApi } from "@/api/class.api";
import { ClassCard } from "@/components/classes/ClassCard";
import { ClassEnrollmentForm } from "@/components/classes/ClassEnrollmentForm";
import { ClassForm } from "@/components/classes/ClassForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useUser } from "@/context/UserContext";
import type { CourseClass, CourseClassRequest } from "@/types/course-class";
import type { UserSummary } from "@/types/user";

export function ClassesPage() {
  const { user } = useUser();
  const [classes, setClasses] = useState<CourseClass[]>([]);
  const [editingClass, setEditingClass] = useState<CourseClass | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [studentsByClassId, setStudentsByClassId] = useState<
    Record<number, UserSummary[]>
  >({});
  const [selectedClass, setSelectedClass] = useState<CourseClass | null>(null);
  const [studentsLoadingId, setStudentsLoadingId] = useState<number | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [studentSort, setStudentSort] = useState<{
    key: "lastname" | "firstname";
    direction: "asc" | "desc";
  }>({
    key: "lastname",
    direction: "asc",
  });

  useEffect(() => {
    const loadClasses = async () => {
      try {
        const data =
          user?.role === "STUDENT"
            ? await classApi.listMine()
            : await classApi.listTeaching();
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
  }, [user?.role]);

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
        current.map((item) => (item.id === updated.id ? updated : item)),
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
      setClasses((current) =>
        current.filter((item) => item.id !== courseClass.id),
      );
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

  const handleViewStudents = async (courseClass: CourseClass) => {
    setSelectedClass(courseClass);
    setStudentsLoadingId(courseClass.id);
    setError(null);

    try {
      const students = await classApi.listStudents(courseClass.id);
      setStudentsByClassId((current) => ({
        ...current,
        [courseClass.id]: students,
      }));
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || "Unable to load enrolled students.";
      setError(msg);
    } finally {
      setStudentsLoadingId(null);
    }
  };

  const handleStudentSort = (key: "lastname" | "firstname") => {
    setStudentSort((current) => {
      if (current.key === key) {
        return {
          key,
          direction: current.direction === "asc" ? "desc" : "asc",
        };
      }

      return {
        key,
        direction: "asc",
      };
    });
  };

  const sortedStudents = useMemo(() => {
    if (!selectedClass) return [];

    const students = studentsByClassId[selectedClass.id] ?? [];
    const multiplier = studentSort.direction === "asc" ? 1 : -1;

    return [...students].sort((left, right) => {
      const leftValue = (left[studentSort.key] ?? "").toLowerCase();
      const rightValue = (right[studentSort.key] ?? "").toLowerCase();
      return leftValue.localeCompare(rightValue) * multiplier;
    });
  }, [selectedClass, studentSort, studentsByClassId]);

  const isTeacherView = user?.role === "INSTRUCTOR" || user?.role === "ADMIN";
  const isStudentView = user?.role === "STUDENT";

  if (isStudentView) {
    return (
      <div className="space-y-6">
        <section className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Classes</h1>
          <p className="text-muted-foreground">
            Enroll in a class using a valid class code and manage your active
            classes.
          </p>
        </section>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <ClassEnrollmentForm
          onEnrolled={(courseClass) => {
            setClasses((current) => {
              if (current.some((item) => item.id === courseClass.id)) {
                return current;
              }
              return [courseClass, ...current];
            });
          }}
        />

        <Separator />

        <section className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold">Enrolled Classes</h2>
            <p className="text-sm text-muted-foreground">
              These are the classes you can now use for project work.
            </p>
          </div>

          {loading ? (
            <p className="text-sm text-muted-foreground">Loading classes...</p>
          ) : classes.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              You are not enrolled in any class yet.
            </p>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {classes.map((courseClass) => (
                <ClassCard key={courseClass.id} courseClass={courseClass} />
              ))}
            </div>
          )}
        </section>
      </div>
    );
  }

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

      {selectedClass ? (
        <section className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold">
                {selectedClass.classCode} - {selectedClass.title}
              </h2>
              <p className="text-sm text-muted-foreground">
                Enrolled students for this class.
              </p>
            </div>
            <Button variant="outline" onClick={() => setSelectedClass(null)}>
              Back To My Classes
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Enrolled Students</CardTitle>
            </CardHeader>
            <CardContent>
              {studentsLoadingId === selectedClass.id ? (
                <p className="text-sm text-muted-foreground">
                  Loading students...
                </p>
              ) : (studentsByClassId[selectedClass.id] ?? []).length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No enrolled students yet.
                </p>
              ) : (
                <div className="overflow-x-auto rounded-md border">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50">
                      <tr className="border-b">
                        <th className="w-16 px-4 py-3 text-left font-medium">
                          #
                        </th>
                        <th className="px-4 py-3 text-left font-medium">
                          <button
                            type="button"
                            className="inline-flex items-center gap-2"
                            onClick={() => handleStudentSort("lastname")}
                          >
                            Lastname
                            {studentSort.key === "lastname"
                              ? studentSort.direction === "asc"
                                ? "↑"
                                : "↓"
                              : ""}
                          </button>
                        </th>
                        <th className="px-4 py-3 text-left font-medium">
                          <button
                            type="button"
                            className="inline-flex items-center gap-2"
                            onClick={() => handleStudentSort("firstname")}
                          >
                            Firstname
                            {studentSort.key === "firstname"
                              ? studentSort.direction === "asc"
                                ? "↑"
                                : "↓"
                              : ""}
                          </button>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedStudents.map((student, index) => (
                        <tr key={student.id} className="border-b last:border-b-0">
                          <td className="px-4 py-3 text-muted-foreground">
                            {index + 1}
                          </td>
                          <td className="px-4 py-3">{student.lastname}</td>
                          <td className="px-4 py-3">{student.firstname}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      ) : (
        <section className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold">My Classes</h2>
            <p className="text-sm text-muted-foreground">
              Select a class card to view enrolled students.
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
                  onSelect={handleViewStudents}
                  onEdit={setEditingClass}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
