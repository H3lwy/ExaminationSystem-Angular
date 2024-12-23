import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SubjectService } from '../../../services/subject.service';
import { ExamHistoryBySubject } from '../../../models/exam-history-by-subject.model';
import { HeaderComponent } from '../../../shared/header/header.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-exam-history',
  standalone:true,
  imports: [HeaderComponent, CommonModule],
  templateUrl: './exam-history.component.html',
  styleUrl: './exam-history.component.css',
})
export class SubjectExamHistoryComponent implements OnInit {
  examHistories: ExamHistoryBySubject[] = [];
  errorMessage: string | null = null;
  subjectId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private subjectService: SubjectService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const subjectIdParam = params.get('subjectId');
      console.log('Extracted subjectId using params:', subjectIdParam);
      this.subjectId = subjectIdParam ? +subjectIdParam : null;

      if (this.subjectId && this.subjectId > 0) {
        this.loadExamHistories(this.subjectId);
      } else {
        this.errorMessage = 'Invalid Subject ID.';
        console.error('Invalid Subject ID from params:', subjectIdParam);
      }
    });
  }

  loadExamHistories(subjectId: number): void {
    console.log('Loading exam histories for subjectId:', subjectId);
    this.subjectService.getExamHistoryBySubject(subjectId).subscribe({
      next: (response) => {
        this.examHistories = response.$values;
        console.log('Exam Histories loaded:', this.examHistories);
      },
      error: (error) => {
        this.errorMessage = error.error || 'Failed to load exam histories.';
        console.error('Error loading exam histories:', error);
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/admin/subjects']);
  }

  onHeaderAction(action: string): void {
    if (action === 'back') {
      window.history.back();
    }
  }
}
