import { Choice } from "./choices.model";

export interface QuestionWithChoicesDto {
  questionText: string;
  subjectId: number | null;
  choices: Choice[];
}
