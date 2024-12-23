import { Answer } from "./Answer.model";

export interface Submission {
  StudentId: string;
  ExamId: number;
  SubjectId: number;
  Answers: Answer[];
}
