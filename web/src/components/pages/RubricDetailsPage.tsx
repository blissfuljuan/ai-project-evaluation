import { useEffect, useState } from "react";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { classApi } from "@/api/class.api";
import { rubricApi } from "@/api/rubric.api";
import { RubricFormDialog } from "@/components/rubrics/RubricFormDialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { CourseClass } from "@/types/course-class";
import type { CreateRubricRequest, Rubric } from "@/types/rubric";

export function RubricDetailsPage() {
  const navigate = useNavigate();
  const { rubricId } = useParams();
  const numericRubricId = Number(rubricId);

  const [classes, setClasses] = useState<CourseClass[]>([]);
  const [rubric, setRubric] = useState<Rubric | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadRubric = async () => {
    if (Number.isNaN(numericRubricId)) {
      setError("Invalid rubric id.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const [teachingClasses, rubricDetails] = await Promise.all([
        classApi.listTeaching(),
        rubricApi.getById(numericRubricId),
      ]);

      setClasses(teachingClasses);
      setRubric(rubricDetails);
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Unable to load rubric details.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRubric();
  }, [numericRubricId]);

  const handleDelete = async () => {
    if (!rubric) {
      return;
    }

    const shouldDelete = window.confirm(`Delete the "${rubric.name}" rubric?`);

    if (!shouldDelete) {
      return;
    }

    try {
      setError(null);
      await rubricApi.remove(rubric.id);
      navigate("/app/rubrics");
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Unable to delete rubric.";
      setError(message);
    }
  };

  const handleSubmit = async (payload: CreateRubricRequest) => {
    if (!rubric) {
      return;
    }

    try {
      setSaving(true);
      setError(null);
      const updatedRubric = await rubricApi.update(rubric.id, payload);
      setRubric(updatedRubric);
      setDialogOpen(false);
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Unable to save rubric.";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const totalWeight =
    rubric?.criteria.reduce((sum, criterion) => sum + criterion.weight, 0) ?? 0;
  const totalPoints =
    rubric?.criteria.reduce((sum, criterion) => sum + criterion.maxScore, 0) ??
    0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button variant="outline" onClick={() => navigate("/app/rubrics")}>
          <ArrowLeft />
          Back to Rubrics
        </Button>

        {rubric && (
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setDialogOpen(true)}>
              <Pencil />
              Edit Rubric
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 />
              Delete Rubric
            </Button>
          </div>
        )}
      </div>

      {loading && (
        <p className="text-sm text-muted-foreground">
          Loading rubric details...
        </p>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      {!loading && rubric && (
        <>
          <section className="space-y-1 text-left">
            <h1 className="text-3xl font-bold tracking-tight">{rubric.name}</h1>
            <p className="text-muted-foreground">
              {rubric.courseClassCode
                ? `${rubric.courseClassCode} - ${rubric.courseClassTitle ?? "Class"}`
                : "Unassigned class"}
            </p>
          </section>

          <Card>
            <CardHeader>
              <CardTitle>Rubric Overview</CardTitle>
              <CardDescription>
                Basic information and scoring totals for this rubric.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {rubric.description || "No description provided."}
              </p>

              <div className="grid gap-3 md:grid-cols-3">
                <div className="rounded-lg border p-4">
                  <p className="text-sm text-muted-foreground">Criteria</p>
                  <p className="text-2xl font-semibold">
                    {rubric.criteria.length}
                  </p>
                </div>
                <div className="rounded-lg border p-4">
                  <p className="text-sm text-muted-foreground">Weight Total</p>
                  <p className="text-2xl font-semibold">{totalWeight}%</p>
                </div>
                <div className="rounded-lg border p-4">
                  <p className="text-sm text-muted-foreground">Max Points</p>
                  <p className="text-2xl font-semibold">{totalPoints}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Criteria</CardTitle>
              <CardDescription>
                Detailed scoring dimensions included in this rubric.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {rubric.criteria.map((criterion) => (
                <div key={criterion.id} className="rounded-xl border p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="text-left space-y-1">
                      <h3 className="font-semibold">
                        {criterion.criterionName}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {criterion.description ||
                          "No criterion description provided."}
                      </p>
                    </div>
                    <div className="shrink-0 text-right text-sm text-muted-foreground">
                      <p>{criterion.weight}%</p>
                      <p>{criterion.maxScore} pts</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </>
      )}

      {!loading && !rubric && !error && (
        <div className="rounded-xl border bg-background p-6">
          <h2 className="text-lg font-semibold">Rubric not found</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            The rubric you requested could not be found.
          </p>
        </div>
      )}

      <RubricFormDialog
        classes={classes}
        initialRubric={rubric}
        mode="edit"
        open={dialogOpen}
        saving={saving}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
