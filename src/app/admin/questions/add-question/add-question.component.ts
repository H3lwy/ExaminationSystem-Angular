import { Component, OnInit } from '@angular/core';
import { Subject } from '../../../models/subject';

import { AdminService } from '../../../services/admin.service';
import { Router } from '@angular/router';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../shared/header/header.component';
import { SubjectService } from '../../../services/subject.service';
import { QuestionService } from '../../../services/question.service';

@Component({
  selector: 'app-add-question',
  imports: [CommonModule, ReactiveFormsModule, HeaderComponent],
  standalone: true,
  templateUrl: './add-question.component.html',
  styleUrl: './add-question.component.css',
  providers: [AdminService],
})
export class AddQuestionComponent implements OnInit {
  questionForm: FormGroup;
  subjects: any[] = [];
  loading: boolean = false;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private subjectService: SubjectService,
    private questionService: QuestionService,
    private router: Router
  ) {
    this.questionForm = this.fb.group({
      questionText: ['', [Validators.required, Validators.minLength(5)]],
      subjectId: ['', Validators.required],
      choices: this.fb.array([
        this.createChoice(),
        this.createChoice(),
        this.createChoice(),
        this.createChoice(),
      ]),
    });
  }

  ngOnInit(): void {
    this.loadSubjects();
    console.log('Subjects:', this.subjects);
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

  get choices(): FormArray {
    return this.questionForm.get('choices') as FormArray;
  }

  createChoice(): FormGroup {
    return this.fb.group({
      choiceText: ['', Validators.required],
      isCorrect: [false, Validators.required],
    });
  }

  addChoice(): void {
    this.choices.push(this.createChoice());
  }

  removeChoice(index: number): void {
    if (this.choices.length > 2) {
      this.choices.removeAt(index);
    }
  }

  onSubmit() {
    console.log('Form Valid:', this.questionForm.valid);
    console.log('Form Values:', this.questionForm.value);
    if (this.questionForm.valid) {
      // إرسال البيانات
      this.questionService.addQuestion(this.questionForm.value).subscribe({
        next: () => {
          alert('Question added successfully!');
          this.router.navigate(['/admin/questions']);
        },
        error: (error) => {
          console.error('Failed to add question:', error);
        },
      });
    } else {
      console.warn('Form is not valid.');
    }
  }

  onHeaderAction(action: string) {
    if (action === 'cancel') {
      this.cancel();
    }
  }

  cancel(): void {
    this.router.navigate(['/admin/questions']);
  }
}
