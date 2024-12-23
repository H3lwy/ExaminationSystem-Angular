import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../../shared/header/header.component';
import { SubjectService } from '../../../services/subject.service';

@Component({
  selector: 'app-add-subject',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './add-subject.component.html',
  styleUrls: ['./add-subject.component.css'],
})
export class AddSubjectComponent {
  newSubject = { subjectName: '', subjectDescription: '' };
  errorMessage: string | null = null;

  constructor(private subjectService: SubjectService, private router: Router) {}

  addSubject(): void {
    if (!this.newSubject.subjectName || !this.newSubject.subjectDescription) {
      this.errorMessage = 'Please provide subject name and description.';
      return;
    }

    this.subjectService.addSubject(this.newSubject).subscribe({
      next: () => {
        alert('Subject added successfully!');
        this.router.navigate(['/admin/subjects']);
      },
      error: (error) => {
        this.errorMessage = 'Failed to add subject.';
        console.error('Error adding subject:', error);
      },
    });
  }

  onHeaderAction(action: string) {
    if (action === 'gotoSubjects') {
      this.gotoSubjects();
    }
  }

  gotoSubjects(): void {
    this.router.navigate(['/admin/subjects']);
  }
}
