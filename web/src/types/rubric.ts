export interface RubricCriterion {
  id: number;
  criterionName: string;
  description: string;
  weight: number;
  maxScore: number;
  displayOrder: number;
}

export interface Rubric {
  id: number;
  name: string;
  description: string;
  courseClassId: number;
  courseClassCode?: string;
  courseClassTitle?: string;
  criteria: RubricCriterion[];
  createdAt: string;
  updatedAt: string;
}

export interface RubricCriterionInput {
  criterionName: string;
  description: string;
  weight: number;
  maxScore: number;
}

export interface CreateRubricRequest {
  name: string;
  description: string;
  courseClassId: number;
  criteria: RubricCriterionInput[];
}

export interface UpdateRubricRequest extends CreateRubricRequest {}
