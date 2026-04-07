import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import { classApi } from "@/api/class.api";
import { projectApi } from "@/api/project.api";
import type { CourseClass } from "@/types/course-class";
import type { CreateProjectRequest } from "@/types/project";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

export function CreateProjectForm() {
  const navigate = useNavigate();
  const [classes, setClasses] = useState<CourseClass[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [courseClassId, setCourseClassId] = useState("");
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadClasses = async () => {
      try {
        const data = await classApi.listMine();
        setClasses(data);
      } catch (err: any) {
        const msg =
          err?.response?.data?.message ||
          "Unable to load classes for project creation.";
        setError(msg);
      } finally {
        setLoadingClasses(false);
      }
    };

    loadClasses();
  }, []);

  useEffect(() => {
    if (classes.length === 1) {
      setCourseClassId(String(classes[0].id));
    }
  }, [classes]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!courseClassId) {
      setError("Please select a class.");
      return;
    }

    const payload: CreateProjectRequest = {
      title: title.trim(),
      description: description.trim(),
      courseClassId: Number(courseClassId),
    };

    try {
      setSaving(true);
      await projectApi.create(payload);
      navigate("/app/projects");
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || "Unable to create project right now.";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="max-w-3xl">
      <CardHeader>
        <CardTitle>Create Project</CardTitle>
        <CardDescription>
          Add a software project under one of your enrolled classes.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="title">Project title</Label>
            <Input
              id="title"
              maxLength={150}
              placeholder="Enter project title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="courseClassId">Enrolled class</Label>
            {loadingClasses && (
              <p className="text-sm text-muted-foreground">Loading enrollment...</p>
            )}
            {!loadingClasses && classes.length > 0 && (
              <Select
                disabled={saving}
                value={courseClassId}
                onValueChange={setCourseClassId}
              >
                <SelectTrigger id="courseClassId" className="w-full">
                  <SelectValue placeholder="Select your enrolled class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((courseClass) => (
                    <SelectItem
                      key={courseClass.id}
                      value={String(courseClass.id)}
                    >
                      {courseClass.classCode} - {courseClass.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {!loadingClasses && classes.length === 0 && (
              <p className="text-sm text-muted-foreground">
                You must be enrolled in a class before you can create a project.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              maxLength={5000}
              placeholder="Describe the project scope, goals, or requirements"
              rows={6}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/app/projects")}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving || loadingClasses || classes.length === 0}
            >
              {saving ? "Creating..." : "Create Project"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
