import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../shared/header/header.component';
import { QuestionService } from '../../../services/question.service';

@Component({
  selector: 'app-questions',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css'],
  providers: [AdminService],
})
export class QuestionsComponent implements OnInit {
  questions: any[] = [];
  isLoading: boolean = true;
  currentPage: number = 1;
  totalPages: number = 1;
  pageSize: number = 10;

  constructor(private questionService: QuestionService , private router: Router) {}

  ngOnInit(): void {
    this.loadQuestions();
  }

  loadQuestions(): void {
    this.isLoading = true;
    this.questionService.getQuestions(this.currentPage, this.pageSize).subscribe({
      next: (response: any) => {
        console.log('Questions Response:', response);

        // التحقق من وجود questions
        if (response && response.questions) {
          let questionsData = response.questions;

          // إذا كان questionsData يحتوي على $values
          if (questionsData.$values) {
            questionsData = questionsData.$values;
          }

          if (Array.isArray(questionsData)) {
            this.questions = questionsData.map((q: any) => {
              let choicesArray = q.choices;
              // تحويل choices إذا كانت تحتوي على $values
              if (choicesArray && choicesArray.$values) {
                choicesArray = choicesArray.$values;
              }

              return {
                QuestionId: q.questionId,
                QuestionText: q.questionText,
                SubjectName: q.subjectName || 'No Subject',
                Choices: Array.isArray(choicesArray) ? choicesArray : [],
              };
            });

            this.totalPages = response.totalPages;
            this.currentPage = response.currentPage;
          } else {
            console.error(
              'Questions is not an array after handling $values:',
              questionsData
            );
            this.questions = [];
          }
        } else {
          console.error(
            'Questions not found or response not in expected format:',
            response
          );
          this.questions = [];
        }

        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading questions:', error);
        this.questions = [];
        this.isLoading = false;
      },
    });
  }

  addQuestion(): void {
    this.router.navigate(['/admin/questions/add']);
  }

  editQuestion(questionId: number): void {
    this.router.navigate(['/admin/questions/edit', questionId]);
  }

  deleteQuestion(questionId: number): void {
    if (confirm('Are you sure you want to delete this question?')) {
      this.questionService.deleteQuestion(questionId).subscribe({
        next: () => {
          alert('Question deleted successfully.');
          this.loadQuestions();
        },
        error: (error) => {
          console.error('Error deleting question:', error);
          alert('Failed to delete the question.');
        },
      });
    }
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadQuestions();
    }
  }

  getPageArray(): number[] {
    const maxVisiblePages = 5;
    const pages: number[] = [];

    let startPage = Math.max(
      1,
      this.currentPage - Math.floor(maxVisiblePages / 2)
    );
    let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  onHeaderAction(action: string) {
    if (action === 'addQuestion') {
      this.addQuestion();
    } else if (action === 'goToDashboard') {
      this.goToDashboard();
    }
  }

  goToDashboard(): void {
    this.router.navigate(['/admin/dashboard']);
  }
}
