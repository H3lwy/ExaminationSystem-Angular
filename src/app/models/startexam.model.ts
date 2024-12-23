export class StartExam {
  studentId: string;
  examId: number;
  subjectId: number;
  questions: any[] = [];
  answers: { questionId: number; selectedChoiceId: number }[] = [];
  showResults: boolean = false;
  examScore: number = 0;
  isPassed: boolean = false;
  passingScore: number = 0;
  remainingTime: number = 0;
  timerInterval: any;

  constructor(
    studentId: string,
    examId: number,
    subjectId: number,
    passingScore: number
  ) {
    this.studentId = studentId;
    this.examId = examId;
    this.subjectId = subjectId;
    this.passingScore = passingScore;
  }
}