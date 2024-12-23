import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  FormControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from '../../../services/admin.service';
import { Question } from '../../../models/questions.model';
import { Subject } from '../../../models/subject';
import { HeaderComponent } from '../../../shared/header/header.component';
import { ExamService } from '../../../services/exam.service';
import { SubjectService } from '../../../services/subject.service';
import { QuestionService } from '../../../services/question.service';

@Component({
  selector: 'app-add-exam',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HeaderComponent],
  templateUrl: './add-exam.component.html',
  styleUrls: ['./add-exam.component.css'],
})
export class AddExamComponent implements OnInit {
  examForm: FormGroup;
  subjects: Subject[] = [];
  questions: Question[] = [];
  selectedQuestions: number[] = [];
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private examService: ExamService,
    private subjectService: SubjectService,
    private questionService: QuestionService,
    private router: Router
  ) {
    this.examForm = this.fb.group({
      examName: ['', [Validators.required, Validators.minLength(3)]],
      subjectId: ['', Validators.required],
      timeLimit: [
        '00:30:00',
        [
          Validators.required,
          Validators.pattern('^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$'),
        ],
      ],
      passScore: [
        '',
        [Validators.required, Validators.min(0), Validators.max(100)],
      ],
    });
  }

  ngOnInit() {
    this.loadSubjects();
  }

  loadSubjects() {
    this.loading = true;
    console.log('Fetching subjects...');
    this.subjectService.getSubjects().subscribe({
      next: (response) => {
        console.log('API response:', response);
        this.subjects = response.$values || response;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching subjects:', error);
        this.errorMessage = 'Failed to load subjects. Please try again later.';
        this.loading = false;
      },
    });
  }

  loadQuestions(subjectId: number): void {
    this.questionService.getQuestionsBySubject(subjectId).subscribe({
      next: (response: any) => {
        if (response.$values) {
          this.questions = response.$values;
          console.log('Questions loaded:', this.questions);
        } else {
          this.questions = response;
        }
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

  onQuestionSelect(questionId: number): void {
    if (this.selectedQuestions.includes(questionId)) {
      this.selectedQuestions = this.selectedQuestions.filter(
        (id) => id !== questionId
      );
    } else {
      this.selectedQuestions.push(questionId);
    }
  }

  toggleQuestionSelection(questionId: number, event: Event): void {
    event.stopPropagation();
    this.onQuestionSelect(questionId);
  }

  onSubmit() {
    if (this.examForm.valid) {
      const examDto = {
        ...this.examForm.value,
        questionIds: this.selectedQuestions,
      };

      this.loading = true;
      this.examService.addExam(examDto).subscribe({
        next: (response) => {
          alert('Exam added successfully!');
          this.router.navigate(['/admin/exams']);
          this.loading = false;
        },
        error: (error) => {
          console.error('Failed to add exam:', error);
          this.errorMessage = 'Failed to add exam. Please try again.';
          this.loading = false;
        },
      });
    }
  }

  onHeaderAction(action: string) {
    if (action === 'cancel') {
      this.cancel();
    }
  }

  cancel() {
    this.router.navigate(['/admin/exams']);
  }
}
