import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentService } from '../../../services/student.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../../shared/header/header.component';
import { QuestionService } from '../../../services/question.service';
import { SubjectService } from '../../../services/subject.service';

@Component({
  selector: 'app-edit-question',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './edit-question.component.html',
  styleUrl: './edit-question.component.css',
})
export class EditQuestionComponent implements OnInit {
  questionId!: number;
  questionData = {
    questionText: '',
    choices: [
      { choiceText: '', isCorrect: false },
      { choiceText: '', isCorrect: false },
      { choiceText: '', isCorrect: false },
      { choiceText: '', isCorrect: false },
    ],
    subjectId: null,
    subjectName: '',
  };
  subjects: any[] = [];

  constructor(
    private questionService: QuestionService,
    private subjectService: SubjectService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.questionId = +params['id'];
      this.loadQuestion();
      this.loadSubjects();
    });
  }

  loadQuestion() {
    this.questionService.getQuestionById(this.questionId).subscribe({
      next: (response: any) => {
        this.questionData.questionText = response.questionText;
        this.questionData.choices =
          response.choices?.$values?.map((choice: any) => ({
            choiceText: choice.choiceText,
            isCorrect: choice.isCorrect,
          })) || [];
        this.questionData.subjectName = response.subjectName;
        this.questionData.subjectId = response.subjectId;
        console.log('Exam Data Loaded:', this.questionData);
        console.log('Selected Subject ID:', this.questionData.subjectId);
      },
      error: (error) => {
        console.error('Error loading question:', error);
        alert('Failed to load question');
      },
    });
  }

  loadSubjects(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.subjectService.getSubjects().subscribe({
        next: (response: any) => {
          this.subjects = response.$values || response;
          console.log('Subjects loaded:', this.subjects);
          resolve();
        },
        error: (error) => {
          console.error('Failed to load subjects:', error);
          reject(error);
        },
      });
    });
  }

  onSubmit() {
    console.log('Submitting data:', JSON.stringify(this.questionData, null, 2));
    this.questionService
      .updateQuestion(this.questionId, this.questionData)
      .subscribe({
        next: () => {
          alert('Question updated successfully');
          this.router.navigate(['/admin/questions']);
        },
        error: (error) => {
          console.error('Error updating question:', error);
          alert('Failed to update question');
        },
      });
  }

  onHeaderAction(action: string) {
    if (action === 'onCancel') {
      this.onCancel();
    }
  }

  onCancel() {
    this.router.navigate(['/admin/questions']);
  }
}