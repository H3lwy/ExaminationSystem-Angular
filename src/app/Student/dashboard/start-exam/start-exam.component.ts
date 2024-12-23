import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CommonModule } from '@angular/common';
import { StudentService } from '../../../services/student.service';
import { AuthService } from '../../../services/auth.service';
import { HeaderComponent } from '../../../shared/header/header.component';

@Component({
  selector: 'app-start-exam',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './start-exam.component.html',
  styleUrls: ['./start-exam.component.css'],
  providers: [StudentService],
})
export class StartExamComponent implements OnInit {
  studentId: string = '';
  examId: number = 0;
  subjectId: number = 0;
  questions: any[] = [];
  answers: { questionId: number; selectedChoiceId: number }[] = [];
  showResults: boolean = false;
  examScore: number = 0;
  isPassed: boolean = false;
  passingScore: number = 0;
  remainingTime: number = 0;
  timerInterval: any;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private studentService: StudentService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const userInfo = this.authService.getUserInfo();
    if (!this.authService.isLoggedIn()) {
      alert('You are not registered. Please log in to continue.');
      this.router.navigate(['/login']);
    }
    if (userInfo) {
      this.studentId = userInfo.nameid || '';
      console.log('Logged-in Student ID:', this.studentId);
    } else {
      console.error('User Info is missing or token is invalid');
      alert('User not logged in. Please login again.');
      return;
    }
    
    this.examId = +this.route.snapshot.paramMap.get('examId')!;
    this.subjectId = +this.route.snapshot.queryParamMap.get('subjectId')!;
    this.loadQuestions();
  }
  ngOnDestroy(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  loadQuestions(): void {
    console.log(`Fetching questions for Exam ID: ${this.examId}`);
    this.studentService.getRandomQuestions(this.examId).subscribe({
      next: (response) => {
        console.log('Full Response:', response);

        if (response.questions && response.questions.$values) {
          this.questions = response.questions.$values;
          console.log('Loaded Questions:', this.questions);
        } else {
          console.error('Questions not found in response.');
          return;
        }

        if (response.timeLimit) {
          console.log('Time Limit:', response.timeLimit);
          const [hours, minutes, seconds] = response.timeLimit
            .split(':')
            .map(Number);
          this.remainingTime = hours * 3600 + minutes * 60 + seconds;
          this.startTimer();
        } else {
          console.error('TimeLimit not found in response.');
        }
      },
      error: (error) => {
        console.error('Error loading questions:', error);
      },
    });
  }

  startTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }

    this.timerInterval = setInterval(() => {
      if (this.remainingTime > 0) {
        this.remainingTime--;
      } else {
        clearInterval(this.timerInterval);
        this.submitExam();

        setTimeout(() => {
          this.router.navigate(['/student/dashboard']);
        }, 5000);
      }
    }, 1000);
  }

  formatTime(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m
      .toString()
      .padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  isChoiceSelected(questionId: number, choiceId: number): boolean {
    return this.answers.some(
      (answer) =>
        answer.questionId === questionId && answer.selectedChoiceId === choiceId
    );
  }

  isSubmitting: boolean = false;

  submitExam(): void {
    if (this.isSubmitting) return;
    this.isSubmitting = true;

    const submission = {
      StudentId: this.studentId,
      ExamId: this.examId,
      SubjectId: this.subjectId,
      Answers: this.answers,
    };

    console.log('Submitting Exam Data:', submission);

    this.studentService.submitExamAnswers(submission).subscribe({
      next: (response) => {
        console.log('Exam Submitted Successfully:', response);

        this.examScore = response.score;
        this.passingScore = response.passScore;
        this.isPassed = this.examScore >= this.passingScore;
        this.showResults = true;
      },
      error: (error) => {
        console.error('Error submitting exam:', error);
        alert('Failed to submit the exam. Please try again later.');
      },
      complete: () => {
        this.isSubmitting = false;
      },
    });
  }

  goToHome(): void {
    this.router.navigate(['/student/dashboard']);
  }

  selectAnswer(questionId: number, choiceId: number): void {
    const existingAnswer = this.answers.find(
      (a) => a.questionId === questionId
    );

    if (existingAnswer) {
      existingAnswer.selectedChoiceId = choiceId;
    } else {
      this.answers.push({ questionId, selectedChoiceId: choiceId });
    }
  }
}
