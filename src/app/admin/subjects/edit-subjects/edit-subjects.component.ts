import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { HeaderComponent } from '../../../shared/header/header.component';
import { SubjectService } from '../../../services/subject.service';

@Component({
  selector: 'app-edit-subject',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './edit-subjects.component.html',
  styleUrls: ['./edit-subjects.component.css'],
})
export class EditSubjectComponent implements OnInit {
  subjectId: number | null = null;
  subjectData = {
    subjectName: '',
    subjectDescription: '',
  };
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private subjectService: SubjectService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.subjectId = +this.route.snapshot.paramMap.get('id')!;
    if (!this.subjectId) {
      this.errorMessage = 'Invalid Subject ID.';
      return;
    }
    this.loadSubjectData();
  }

  loadSubjectData(): void {
    this.subjectService.getSubjectById(this.subjectId!).subscribe({
      next: (subject) => {
        this.subjectData.subjectName = subject.subjectName;
        this.subjectData.subjectDescription = subject.subjectDescription;
      },
      error: (error) => {
        this.errorMessage = `Subject with ID ${this.subjectId} not found.`;
        console.error('Error loading subject data:', error);
      },
    });
  }

  updateSubject(): void {
    if (!this.subjectId) return;
    this.subjectService.editSubject(this.subjectId, this.subjectData).subscribe({
      next: () => {
        alert('Subject updated successfully!');
        this.router.navigate(['/admin/subjects']);
      },
      error: (error) => {
        this.errorMessage = 'Failed to update subject. Please try again.';
        console.error('Error updating subject:', error);
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
