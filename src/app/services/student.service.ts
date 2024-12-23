import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private apiUrl = 'https://localhost:7113/api';

  constructor(private http: HttpClient) {}

  getSubjects(): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}/Subject/AllSubjects`).pipe(
      map((response) => {
        if (Array.isArray(response)) {
          return response;
        }
        else if (response && response.hasOwnProperty('$values')) {
          return response.$values;
        }
        console.warn('Unexpected response format:', response);
        return [];
      }),
      catchError((error) => {
        console.error('Error fetching subjects:', error);
        return throwError(() => new Error('Failed to fetch subjects'));
      })
    );
  }

  getExamsBySubject(subjectId: number,pageNumber: number = 1,pageSize: number = 10): Observable<any> {
    return this.http.get<any>(
        `${this.apiUrl}/Exam/ExamsBySubject/${subjectId}?pageNumber=${pageNumber}&pageSize=${pageSize}`
      )
      .pipe(
        map((response) => {
          return {
            exams: response.exams.$values || [],
            totalPages: response.totalPages,
            currentPage: response.currentPage,
          };
        }),
        catchError((error) => {
          console.error('Error fetching exams:', error);
          return throwError(() => error);
        })
      );
  }

  getRandomQuestions(examId: number): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/Student/GetRandomQuestions/${examId}`
    );
  }

  submitExamAnswers(submission: any): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/Student/SubmitExamAnswers`,
      submission
    );
  }

  getExamHistory(studentId: string): Observable<any[]> {
    return this.http
      .get<any>(`${this.apiUrl}/Student/GetExamHistory/${studentId}`)
      .pipe(
        map((response) => {
          if (response && response.$values) {
            return response.$values;
          }
          return response;
        }),
        catchError((error) => {
          console.error('Error fetching exam history:', error);
          return throwError(() => new Error('Failed to fetch exam history'));
        })
      );
  }
}
