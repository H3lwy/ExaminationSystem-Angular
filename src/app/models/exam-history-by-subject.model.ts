export interface ExamHistoryBySubject {
  studentExamId: number;
  dateTimeTaken: Date;
  score: number;
  isPassed: boolean;
  examName: string;
  passScore: number;
  studentName: string;
}
