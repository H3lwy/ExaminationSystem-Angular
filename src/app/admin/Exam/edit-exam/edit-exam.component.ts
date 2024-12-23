import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../../services/admin.service';
import { Subject } from '../../../models/subject';
import { Question } from '../../../models/questions.model';
import { HeaderComponent } from '../../../shared/header/header.component';
import { QuestionService } from '../../../services/question.service';
import { SubjectService } from '../../../services/subject.service';
import { ExamService } from '../../../services/exam.service';

@Component({
  selector: 'app-edit-exam',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './edit-exam.component.html',
  styleUrls: ['./edit-exam.component.css'],
})
export class EditExamComponent implements OnInit {
  examId!: number;
  examData = {
    examName: '',
    subjectId: null as number | null,
    timeLimit: '00:30:00',
    passScore: 0,
    questionIds: [] as number[],
  };

  subjects: Subject[] = [];
  questions: Question[] = [];
  selectedQuestions: number[] = [];
  loading = false;
  errorMessage = '';

  constructor(
    private subjectService: SubjectService,
    private examService: ExamService,
    private questionService: QuestionService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.examId = +params['id'];
      if (this.examId) {
        this.loadExamData().then(() => {
          this.loadSubjects();
          if (this.examData.subjectId) {
            this.loadQuestions(this.examData.subjectId);
          }
        });
      } else {
        console.error('examId is not defined.');
      }
    });
  }

  loadExamData(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.examService.getExamById(this.examId).subscribe({
        next: (response: any) => {
          if (response.questionIds && response.questionIds.$values) {
            response.questionIds = response.questionIds.$values;
          }

          this.examData.examName = response.examName;
          this.examData.subjectId = response.subjectId;
          this.examData.timeLimit = response.timeLimit;
          this.examData.passScore = response.passScore;
          this.examData.questionIds = response.questionIds || [];

          console.log('Exam Data Loaded:', this.examData);
          resolve();
        },
        error: (error) => {
          console.error('Failed to load exam data:', error);
          this.errorMessage = 'Failed to load exam data.';
          reject(error);
        },
      });
    });
  }

  loadSubjects() {
    this.subjectService.getSubjects().subscribe({
      next: (response) => {
        this.subjects = response.$values || response;
        console.log('Subjects loaded:', this.subjects);
      },
      error: (error) => {
        console.error('Failed to load subjects:', error);
        this.errorMessage = 'Failed to load subjects. Please try again later.';
      },
    });
  }

  loadQuestions(subjectId: number): void {
    this.questionService.getQuestionsBySubject(subjectId).subscribe({
      next: (response: any) => {
        let questionsData = response;
        if (questionsData.$values) {
          questionsData = questionsData.$values;
        }

        this.questions = questionsData.map((q: any) => ({
          questionId: q.questionId,
          questionText: q.questionText,
          choices: q.choices?.$values || q.choices || [],
        }));
        this.selectedQuestions = [...(this.examData.questionIds || [])];
        console.log('Selected Questions after load:', this.selectedQuestions);
      },
      error: (error) => {
        console.error('Error loading questions:', error);
        this.questions = [];
      },
    });
  }

  onSubjectChange(event: Event) {
    const subjectId = +(event.target as HTMLSelectElement).value;
    this.loadQuestions(subjectId);
  }

  onQuestionSelect(questionId: number) {
    if (this.selectedQuestions.includes(questionId)) {
      this.selectedQuestions = this.selectedQuestions.filter(
        (id) => id !== questionId
      );
    } else {
      this.selectedQuestions.push(questionId);
    }
  }

  toggleQuestionSelection(questionId: number, event: Event) {
    event.stopPropagation();
    this.onQuestionSelect(questionId);
  }

  onSubmit() {
    this.examData.questionIds = this.selectedQuestions;
    this.examService.editExam(this.examId, this.examData).subscribe({
      next: () => {
        alert('Exam updated successfully!');
        this.router.navigate(['/admin/exams']);
      },
      error: (error) => {
        console.error('Failed to update exam:', error);
        this.errorMessage = 'Failed to update exam. Please try again.';
      },
    });
  }

  cancel() {
    this.router.navigate(['/admin/exams']);
  }
  onHeaderAction(action: string): void {
    if (action === 'back') {
      this.gotoExams();
    }
  }

  gotoExams() {
    this.router.navigate(['/admin/exams']);
  }
}
