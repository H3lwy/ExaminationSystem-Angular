import { Component, OnInit } from '@angular/core';
import { StudentService } from '../../../services/student.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../shared/header/header.component';

@Component({
  selector: 'app-exam-history',
  standalone:true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './exam-history.component.html',
  styleUrl: './exam-history.component.css',
})
export class StudentExamHistoryComponent implements OnInit {
  studentId!: string;
  examHistory: any[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(
    private studentService: StudentService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.studentId = params['id'];
      this.loadExamHistory();
    });
  }

  loadExamHistory(): void {
    this.isLoading = true;
    this.studentService.getExamHistory(this.studentId).subscribe({
      next: (history) => {
        this.examHistory = history;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading exam history:', error);
        this.errorMessage = 'Failed to load exam history.';
        this.isLoading = false;
      },
    });
  }

  onHeaderAction(action: string) {
    if (action === 'back') {
      this.goToStudent();
    }
  }

  goToStudent(): void {
    this.router.navigate(['admin/students']);
  }
}
