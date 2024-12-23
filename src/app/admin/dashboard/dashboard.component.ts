import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AdminService } from '../../services/admin.service';
import { SignalRService } from '../../services/signalr.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  userName: string = '';
  totalStudents: number = 0;
  completedExams: number = 0;
  passedExams: number = 0;
  failedExams: number = 0;
  latestNotification: string = '';
  notifications: string[] = [];

  constructor(
    private adminService: AdminService,
    private authService: AuthService,
    private router: Router,
    private signalRService: SignalRService
  ) {}

  ngOnInit() {
    this.loadDashboardData();
    this.userName = this.authService.getUserName() || 'Admin';

    this.signalRService.startConnection();
    this.signalRService.notification$.subscribe((message) => {
      this.latestNotification = message;
      console.log('New notification received:', message);

      if (!this.notifications.includes(this.latestNotification)) {
        this.notifications.unshift(this.latestNotification);
      }
    });
  }

  loadDashboardData() {
    this.adminService.getAllStudentsNumbers().subscribe({
      next: (count) => (this.totalStudents = count),
      error: (error) => console.error('Error loading students count:', error),
    });

    this.adminService.getCompletedExamsNumbers().subscribe({
      next: (count) => (this.completedExams = count),
      error: (error) => console.error('Error loading completed exams:', error),
    });

    this.adminService.getPassedExamsNumbers().subscribe({
      next: (count) => (this.passedExams = count),
      error: (error) => console.error('Error loading passed exams:', error),
    });

    this.adminService.getFailedExamsNumbers().subscribe({
      next: (count) => (this.failedExams = count),
      error: (error) => console.error('Error loading failed exams:', error),
    });
  }

  showNotifications: boolean = false;

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
    if (
      this.latestNotification &&
      !this.notifications.includes(this.latestNotification)
    ) {
      this.notifications.unshift(this.latestNotification);
    }
  }

  clearNotifications() {
    this.notifications = [];
    this.latestNotification = '';
  }

  navigateToExams() {
    this.router.navigate(['/admin/exams']);
  }

  navigateToSubjects() {
    this.router.navigate(['/admin/subjects']);
  }

  navigateToQuestions() {
    this.router.navigate(['/admin/questions']);
  }

  navigateToAChoices() {
    this.router.navigate(['/admin/choices']);
  }

  navigateToStudents() {
    this.router.navigate(['/admin/students']);
  }

  navigateToStudentsExamHistory() {
    this.router.navigate(['/admin/students']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
