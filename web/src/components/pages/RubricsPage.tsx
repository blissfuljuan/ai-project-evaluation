import { useEffect, useState } from "react";

import { classApi } from "@/api/class.api";
import { rubricApi } from "@/api/rubric.api";
import { RubricFormDialog } from "@/components/rubrics/RubricFormDialog";
import { RubricList } from "@/components/rubrics/RubricList";
import { RubricsPageHeader } from "@/components/rubrics/RubricsPageHeader";
import { Button } from "@/components/ui/button";
import type { CourseClass } from "@/types/course-class";
import type { CreateRubricRequest, Rubric } from "@/types/rubric";

export function RubricsPage() {
  const [classes, setClasses] = useState<CourseClass[]>([]);
  const [rubrics, setRubrics] = useState<Rubric[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRubric, setEditingRubric] = useState<Rubric | null>(null);

  const loadPageData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [teachingClasses, rubricList] = await Promise.all([
        classApi.listTeaching(),
        rubricApi.listMine(),
      ]);

      setClasses(teachingClasses);
      setRubrics(
        rubricList.filter((rubric) =>
          teachingClasses.some((courseClass) => courseClass.id === rubric.courseClassId)
        )
      );
    } catch (err: any) {
      const message =
        err?.response?.data?.message || err?.message || "Unable to load rubrics.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPageData();
  }, []);

  const handleCreate = () => {
    setEditingRubric(null);
    setDialogOpen(true);
  };

  const handleSubmit = async (payload: CreateRubricRequest) => {
    try {
      setSaving(true);
      setError(null);

      if (editingRubric) {
        await rubricApi.update(editingRubric.id, payload);
      } else {
        await rubricApi.create(payload);
      }

      setDialogOpen(false);
      setEditingRubric(null);
      await loadPageData();
    } catch (err: any) {
      const message =
        err?.response?.data?.message || err?.message || "Unable to save rubric.";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <RubricsPageHeader onCreate={handleCreate} />

      {loading && <p className="text-sm text-muted-foreground">Loading rubrics...</p>}

      {!loading && classes.length === 0 && (
        <div className="rounded-xl border bg-background p-6">
          <h2 className="text-lg font-semibold">No teaching classes available</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Rubrics are currently limited to classes you teach. Create or join a
            teaching class first, then come back here to manage your grading rubrics.
          </p>
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      {!loading && classes.length > 0 && (
        <RubricList
          canCreate={classes.length > 0}
          rubrics={rubrics}
          onCreate={handleCreate}
        />
      )}

      {!loading && classes.length > 0 && rubrics.length > 0 && (
        <div className="rounded-xl border bg-background p-4 text-sm text-muted-foreground">
          Select any rubric card to open its details page and manage its criteria.
        </div>
      )}

      {!loading && classes.length > 0 && (
        <div className="flex justify-end">
          <Button variant="outline" onClick={loadPageData}>
            Refresh Rubrics
          </Button>
        </div>
      )}

      <RubricFormDialog
        classes={classes}
        initialRubric={editingRubric}
        mode={editingRubric ? "edit" : "create"}
        open={dialogOpen}
        saving={saving}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) {
            setEditingRubric(null);
          }
        }}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
