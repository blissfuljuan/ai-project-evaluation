import type {
  CreateRubricRequest,
  Rubric,
  RubricCriterion,
  UpdateRubricRequest,
} from "@/types/rubric";

const STORAGE_KEY = "teacher-rubrics";

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readRubrics(): Rubric[] {
  if (!canUseStorage()) {
    return [];
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as Rubric[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeRubrics(rubrics: Rubric[]) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(rubrics));
}

function sortRubrics(rubrics: Rubric[]) {
  return [...rubrics].sort(
    (left, right) =>
      new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime()
  );
}

function mapCriteria(criteria: CreateRubricRequest["criteria"]): RubricCriterion[] {
  return criteria.map((criterion, index) => ({
    id: Date.now() + index,
    criterionName: criterion.criterionName.trim(),
    description: criterion.description.trim(),
    weight: criterion.weight,
    maxScore: criterion.maxScore,
    displayOrder: index + 1,
  }));
}

export const rubricApi = {
  async listMine(): Promise<Rubric[]> {
    return sortRubrics(readRubrics());
  },

  async create(payload: CreateRubricRequest): Promise<Rubric> {
    const rubrics = readRubrics();
    const timestamp = new Date().toISOString();
    const rubric: Rubric = {
      id: Date.now(),
      name: payload.name.trim(),
      description: payload.description.trim(),
      courseClassId: payload.courseClassId,
      courseClassCode: payload.courseClassCode,
      courseClassTitle: payload.courseClassTitle,
      criteria: mapCriteria(payload.criteria),
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    writeRubrics([rubric, ...rubrics]);
    return rubric;
  },

  async update(id: number, payload: UpdateRubricRequest): Promise<Rubric> {
    const rubrics = readRubrics();
    const existing = rubrics.find((rubric) => rubric.id === id);

    if (!existing) {
      throw new Error("Rubric not found.");
    }

    const updated: Rubric = {
      ...existing,
      name: payload.name.trim(),
      description: payload.description.trim(),
      courseClassId: payload.courseClassId,
      courseClassCode: payload.courseClassCode,
      courseClassTitle: payload.courseClassTitle,
      criteria: mapCriteria(payload.criteria),
      updatedAt: new Date().toISOString(),
    };

    writeRubrics(rubrics.map((rubric) => (rubric.id === id ? updated : rubric)));
    return updated;
  },

  async remove(id: number): Promise<void> {
    const rubrics = readRubrics();
    writeRubrics(rubrics.filter((rubric) => rubric.id !== id));
  },
};
