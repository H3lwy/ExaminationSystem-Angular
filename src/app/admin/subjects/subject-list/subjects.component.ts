import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, Router } from '@angular/router';
import { HeaderComponent } from '../../../shared/header/header.component';
import { SubjectService } from '../../../services/subject.service';

@Component({
  selector: 'app-subjects',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './subjects.component.html',
  styleUrls: ['./subjects.component.css'],
})
export class SubjectsComponent implements OnInit {
  subjects: any[] = [];
  errorMessage: string | null = null;

  constructor(private subjectService: SubjectService, private router: Router) {}

  ngOnInit(): void {
    this.loadSubjects();
  }

  loadSubjects(): void {
    this.subjectService.getSubjects().subscribe({
      next: (response) => {
        if (response && response.$values) {
          this.subjects = response.$values;
        } else if (Array.isArray(response)) {
          this.subjects = response;
        } else {
          this.errorMessage = 'Unexpected data format.';
          console.error('Unexpected response format:', response);
        }
        console.log('Subjects loaded:', this.subjects);
      },
      error: (error) => {
        this.errorMessage = 'Failed to load subjects.';
        console.error('Error loading subjects:', error);
      },
    });
  }

  addsubject(): void {
    this.router.navigate(['/admin/subjects/add']);
  }

  editSubject(id: number): void {
    if (!id) {
      console.error('Invalid Subject ID:', id);
      return;
    }
    this.router.navigate([`/admin/subjects/edit`, id]);
  }

  deleteSubject(id: number): void {
    if (confirm('Are you sure you want to delete this subject?')) {
      this.subjectService.deleteSubject(id).subscribe({
        next: () => {
          alert('Subject deleted successfully!');
          this.loadSubjects();
        },
        error: (error) => {
          this.errorMessage = 'Failed to delete subject.';
          console.error('Error deleting subject:', error);
        },
      });
    }
  }

  onHeaderAction(action: string) {
    if (action === 'addsubject') {
      this.addsubject();
    } else if (action === 'goToDashboard') {
      this.goToDashboard();
    }
  }

  goToDashboard(): void {
    this.router.navigate(['/admin/dashboard']);
  }

  viewExamHistory(subjectId: number): void {
    console.log('Navigating to Exam History for subjectId:', subjectId);
    if (!subjectId) {
      console.error('Invalid Subject ID:', subjectId);
      return;
    }
    this.router.navigate(['/admin/subjects/examhistory', subjectId]);
  }
}
