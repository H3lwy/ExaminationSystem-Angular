import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { HeaderComponent } from '../../shared/header/header.component';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css'],
})
export class StudentsComponent implements OnInit {
  students: any[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  pageSize: number = 10;
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(private adminService: AdminService, private router: Router) {}

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.isLoading = true;
    this.adminService.getStudents(this.currentPage, this.pageSize).subscribe({
      next: (response: any) => {
        console.log('API Response:', response);
        if (response && response.students && response.students.$values) {
          console.log('Extracting students:', response.students.$values);

          this.students = response.students.$values.map((student: any) => ({
            id: student.id,
            firstName: student.firstName,
            lastName: student.lastName,
            userName: student.userName,
            email: student.email,
            isActive: student.isActive,
          }));

          this.totalPages = response.totalPages || 1;
          this.currentPage = response.currentPage || 1;
          console.log('Parsed Students:', this.students);
        } else {
          console.error('Invalid response format:', response);
          this.students = [];
        }

        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading students:', error);
        this.errorMessage = 'Failed to load students. Please try again.';
        this.isLoading = false;
      },
    });
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadStudents();
    }
  }

  updateStatus(studentId: string, isActive: boolean): void {
    const newStatus = !isActive;
    this.adminService.updateStudentStatus(studentId, newStatus).subscribe({
      next: () => {
        this.loadStudents();
      },
      error: (error) => {
        console.error('Failed to update status:', error);
        alert('Failed to update the student status. Please try again.');
      },
    });
  }
  
  onHeaderAction(action: string) {
    if (action === 'back') {
      this.backToDashboard();
    }
  }

  backToDashboard(): void {
    this.router.navigate(['/admin/dashboard']);
  }

  viewExamHistory(studentId: string): void {
    this.router.navigate(['/admin/students/exam-history', studentId]);
  }
}
