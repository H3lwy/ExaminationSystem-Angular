import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { StudentService } from '../../../services/student.service';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../../shared/header/header.component';

@Component({
  selector: 'app-exam-history',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './exam-history.component.html',
  styleUrls: ['./exam-history.component.css'],
  providers: [StudentService],
})
export class ExamHistoryComponent implements OnInit {
  studentId: string = '';
  examHistory: any[] = [];
  isLoading: boolean = true;

  constructor(
    private authService: AuthService,
    private studentService: StudentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const userInfo = this.authService.getUserInfo();
    if (userInfo) {
      this.studentId = userInfo.nameid || '';
      this.loadExamHistory();
    } else {
      console.error('User info missing or invalid token.');
    }
  }

  loadExamHistory(): void {
    this.isLoading = true;
    this.studentService.getExamHistory(this.studentId).subscribe({
      next: (history) => {
        console.log('Raw Exam History Response:', history);
        this.examHistory = history;
        console.log('Parsed Exam History:', this.examHistory);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching exam history:', error);
        this.isLoading = false;
      },
    });
  }

  onHeaderAction(action: string): void {
    if (action === 'goToDashboard') {
      this.goToHome();
    }
  }

  goToHome(): void {
    this.router.navigate(['/student/dashboard']);
  }
}
