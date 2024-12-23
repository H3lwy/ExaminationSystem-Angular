import { Component, OnInit } from '@angular/core';
import { StudentService } from '../../services/student.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SignalRService } from '../../services/signalr.service';

@Component({
  selector: 'app-student-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: true,
  providers: [StudentService, AuthService],
})
export class StudentDashboardComponent implements OnInit {
  currentDate: Date = new Date();
  subjects: any[] = [];
  exams: any[] = [];
  selectedSubjectId: number | null = null;
  totalPages: number = 0;
  currentPage: number = 1;
  userName: string = 'Student';

  constructor(
    private studentService: StudentService,
    public router: Router,
    private authService: AuthService,
    private signalRService: SignalRService
  ) {}

  ngOnInit(): void {
    this.userName = this.authService.getUserName() || 'Student';
    this.loadSubjects();
    this.signalRService.startConnection();
    this.signalRService.notification$.subscribe((message) => {
      console.log('New notification received:', message);
    });
  }

  loadSubjects(): void {
    this.studentService.getSubjects().subscribe({
      next: (subjects) => {
        this.subjects = subjects;
        if (this.subjects.length > 0 && !this.selectedSubjectId) {
          this.selectedSubjectId = this.subjects[0].subjectId;
          if (this.selectedSubjectId !== null) {
            this.loadExams(this.selectedSubjectId);
          }
        }
      },
      error: (error) => {
        console.error('Failed to load subjects:', error.message);
      },
    });
  }

  loadExams(subjectId: number): void {
    this.selectedSubjectId = subjectId;
    this.studentService
      .getExamsBySubject(subjectId, this.currentPage)
      .subscribe({
        next: (response) => {
          this.exams = response.exams;
          this.totalPages = response.totalPages;
          this.currentPage = response.currentPage;
        },
        error: (error) => {
          console.error('Error loading exams:', error);
        },
      });
  }

  changePage(page: number): void {
    if (this.selectedSubjectId && page > 0 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadExams(this.selectedSubjectId);
    }
  }

  selectSubject(subjectId: number): void {
    this.selectedSubjectId = subjectId;
    console.log('Selected Subject ID:', subjectId);
    this.loadExams(subjectId);
  }

  startExam(examId: number): void {
    this.router.navigate(['student/exams/start-exam', examId], {
      queryParams: { subjectId: this.selectedSubjectId },
    });
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Logout failed:', error);
        alert('Failed to logout. Please try again.');
      },
    });
  }

  viewExamHistory(): void {
    this.router.navigate(['student/exams/exam-history']);
  }
}
