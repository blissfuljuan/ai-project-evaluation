import { useEffect, useState, type FormEvent } from "react";
import { Plus, Trash2 } from "lucide-react";

import type { CourseClass } from "@/types/course-class";
import type {
  CreateRubricRequest,
  Rubric,
  RubricCriterionInput,
} from "@/types/rubric";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface RubricFormDialogProps {
  open: boolean;
  mode: "create" | "edit";
  classes: CourseClass[];
  initialRubric: Rubric | null;
  saving: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: CreateRubricRequest) => Promise<void>;
}

interface CriterionDraft {
  criterionName: string;
  description: string;
  weight: string;
  maxScore: string;
}

const emptyCriterion = (): CriterionDraft => ({
  criterionName: "",
  description: "",
  weight: "",
  maxScore: "",
});

export function RubricFormDialog({
  open,
  mode,
  classes,
  initialRubric,
  saving,
  onOpenChange,
  onSubmit,
}: RubricFormDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [courseClassId, setCourseClassId] = useState("");
  const [criteria, setCriteria] = useState<CriterionDraft[]>([emptyCriterion()]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    if (initialRubric) {
      setName(initialRubric.name);
      setDescription(initialRubric.description);
      setCourseClassId(String(initialRubric.courseClassId));
      setCriteria(
        initialRubric.criteria.map((criterion) => ({
          criterionName: criterion.criterionName,
          description: criterion.description,
          weight: String(criterion.weight),
          maxScore: String(criterion.maxScore),
        }))
      );
      setError(null);
      return;
    }

    setName("");
    setDescription("");
    setCourseClassId(classes.length === 1 ? String(classes[0].id) : "");
    setCriteria([emptyCriterion()]);
    setError(null);
  }, [classes, initialRubric, open]);

  const updateCriterion = (
    index: number,
    field: keyof CriterionDraft,
    value: string
  ) => {
    setCriteria((current) =>
      current.map((criterion, criterionIndex) =>
        criterionIndex === index ? { ...criterion, [field]: value } : criterion
      )
    );
  };

  const addCriterion = () => {
    setCriteria((current) => [...current, emptyCriterion()]);
  };

  const removeCriterion = (index: number) => {
    setCriteria((current) =>
      current.length === 1
        ? current
        : current.filter((_, criterionIndex) => criterionIndex !== index)
    );
  };

  const normalizeCriteria = (): RubricCriterionInput[] | null => {
    const normalized = criteria.map((criterion) => ({
      criterionName: criterion.criterionName.trim(),
      description: criterion.description.trim(),
      weight: Number(criterion.weight),
      maxScore: Number(criterion.maxScore),
    }));

    const hasEmptyCriterion = normalized.some(
      (criterion) =>
        !criterion.criterionName ||
        Number.isNaN(criterion.weight) ||
        Number.isNaN(criterion.maxScore)
    );

    if (hasEmptyCriterion) {
      setError("Please complete every criterion before saving.");
      return null;
    }

    const hasInvalidNumbers = normalized.some(
      (criterion) => criterion.weight <= 0 || criterion.maxScore <= 0
    );

    if (hasInvalidNumbers) {
      setError("Criterion weight and max score must both be greater than zero.");
      return null;
    }

    const totalWeight = normalized.reduce(
      (sum, criterion) => sum + criterion.weight,
      0
    );

    if (totalWeight !== 100) {
      setError("Criterion weights must total exactly 100%.");
      return null;
    }

    return normalized;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!courseClassId) {
      setError("Please select a class for this rubric.");
      return;
    }

    const normalizedCriteria = normalizeCriteria();

    if (!normalizedCriteria) {
      return;
    }

    const selectedClass = classes.find(
      (courseClass) => courseClass.id === Number(courseClassId)
    );

    if (!selectedClass) {
      setError("Selected class could not be found.");
      return;
    }

    await onSubmit({
      name: name.trim(),
      description: description.trim(),
      courseClassId: selectedClass.id,
      criteria: normalizedCriteria,
    });
  };

  const totalWeight = criteria.reduce((sum, criterion) => {
    const weight = Number(criterion.weight);
    return sum + (Number.isNaN(weight) ? 0 : weight);
  }, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader className="text-left">
          <DialogTitle>{mode === "create" ? "Create Rubric" : "Edit Rubric"}</DialogTitle>
          <DialogDescription>
            Define the class, overview, and weighted criteria for this rubric.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="rubric-name">Rubric name</Label>
              <Input
                id="rubric-name"
                maxLength={150}
                placeholder="Enter rubric name"
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="rubric-class">Class</Label>
              <Select value={courseClassId} onValueChange={setCourseClassId}>
                <SelectTrigger id="rubric-class" className="w-full">
                  <SelectValue placeholder="Select a class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((courseClass) => (
                    <SelectItem key={courseClass.id} value={String(courseClass.id)}>
                      {courseClass.classCode} - {courseClass.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="rubric-description">Description</Label>
              <Textarea
                id="rubric-description"
                maxLength={2000}
                placeholder="Describe what this rubric is intended to assess"
                rows={4}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-semibold">Criteria</h3>
                <p className="text-sm text-muted-foreground">
                  Add the scoring dimensions teachers will evaluate.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <p className="text-sm text-muted-foreground">
                  Total weight: {totalWeight}%
                </p>
                <Button type="button" variant="outline" onClick={addCriterion}>
                  <Plus />
                  Add Criterion
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {criteria.map((criterion, index) => (
                <div key={index} className="space-y-4 rounded-xl border p-4">
                  <div className="flex items-center justify-between gap-3">
                    <h4 className="font-medium">Criterion {index + 1}</h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={criteria.length === 1}
                      onClick={() => removeCriterion(index)}
                    >
                      <Trash2 />
                      Remove
                    </Button>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor={`criterion-name-${index}`}>Name</Label>
                      <Input
                        id={`criterion-name-${index}`}
                        placeholder="Criterion name"
                        value={criterion.criterionName}
                        onChange={(event) =>
                          updateCriterion(index, "criterionName", event.target.value)
                        }
                      />
                    </div>

                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor={`criterion-description-${index}`}>
                        Description
                      </Label>
                      <Textarea
                        id={`criterion-description-${index}`}
                        placeholder="Describe what strong performance looks like"
                        rows={3}
                        value={criterion.description}
                        onChange={(event) =>
                          updateCriterion(index, "description", event.target.value)
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`criterion-weight-${index}`}>Weight (%)</Label>
                      <Input
                        id={`criterion-weight-${index}`}
                        min="1"
                        step="1"
                        type="number"
                        value={criterion.weight}
                        onChange={(event) =>
                          updateCriterion(index, "weight", event.target.value)
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`criterion-max-score-${index}`}>
                        Max score
                      </Label>
                      <Input
                        id={`criterion-max-score-${index}`}
                        min="1"
                        step="1"
                        type="number"
                        value={criterion.maxScore}
                        onChange={(event) =>
                          updateCriterion(index, "maxScore", event.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving || classes.length === 0}>
              {saving
                ? mode === "create"
                  ? "Creating..."
                  : "Saving..."
                : mode === "create"
                  ? "Create Rubric"
                  : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
