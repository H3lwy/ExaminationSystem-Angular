import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../../shared/header/header.component';
import { ExamService } from '../../../services/exam.service';

interface ExamResponse {
  exams: {
    $values: Array<{
      examId: number;
      examName: string;
      subjectName: string;
      timeLimit: string;
      passScore: number;
    }>;
  };
  totalPages: number;
  currentPage: number;
}

@Component({
  selector: 'app-exam-list',
  imports: [CommonModule, HeaderComponent],
  templateUrl: './exam-list.component.html',
  styleUrls: ['./exam-list.component.css'],
  standalone: true,
})
export class ExamListComponent implements OnInit {
  exams: any[] = [];
  totalPages: number = 0;
  currentPage: number = 1;
  pageSize: number = 10;

  constructor(private examService: ExamService, private router: Router) {}

  ngOnInit(): void {
    this.loadExams(1);
  }

  loadExams(page: number): void {
    this.examService.getExams(page, this.pageSize).subscribe({
      next: (response: ExamResponse) => {
        this.exams = response.exams.$values;
        this.totalPages = response.totalPages;
        this.currentPage = response.currentPage;
      },
      error: (error) => {
        console.error('Error fetching exams:', error);
      },
    });
  }

  onAddExam(): void {
    this.router.navigate(['/admin/exams/add-exam']);
  }

  onEditExam(exam: any): void {
    if (!exam || !exam.examId) {
      console.error('Invalid Exam:', exam);
      return;
    }
    console.log('Navigating to edit exam with ID:', exam.examId);
    this.router.navigate([`/admin/exams/edit-exam`, exam.examId]);
  }

  onDeleteExam(examId: number): void {
    if (confirm('Are you sure you want to delete this exam?')) {
      this.examService.deleteExam(examId).subscribe({
        next: () => {
          alert('Exam deleted successfully.');
          this.loadExams(this.currentPage);
        },
        error: (error) => {
          console.error('Error deleting exam:', error);
          alert('Failed to delete the exam. Please try again.');
        },
      });
    }
  }
  onHeaderAction(action: string) {
    if (action === 'addExam') {
      this.onAddExam();
    } else if (action === 'back') {
      this.goToDashboard();
    }
  }
  goToDashboard(): void {
    this.router.navigate(['/admin/dashboard']);
  }
}
