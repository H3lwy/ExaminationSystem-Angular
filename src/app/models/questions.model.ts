import { Choice } from "./choices.model";

export interface Question {
  questionId: number;
  questionText: string;
  choices: Choice[];
  selected?: boolean;
}
