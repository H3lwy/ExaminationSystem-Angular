import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ExamHistoryBySubject } from '../models/exam-history-by-subject.model';

@Injectable({
  providedIn: 'root',
})
export class SubjectService {
  private apiUrl = 'https://localhost:7113/api/Subject';

  constructor(private http: HttpClient) {}

  getSubjects(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/AllSubjects`);
  }

  getExamHistoryBySubject(
    subjectId: number
  ): Observable<{ $values: ExamHistoryBySubject[] }> {
    return this.http.get<{ $values: ExamHistoryBySubject[] }>(
      `${this.apiUrl}/Examhistory/${subjectId}`
    );
  }

  addSubject(subject: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/AddSubject`, subject);
  }

  getSubjectById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  editSubject(subjectId: number, subjectData: any): Observable<any> {
    return this.http.put<any>(
      `${this.apiUrl}/EditSubject/${subjectId}`,
      subjectData
    );
  }

  deleteSubject(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/DeleteSubject/${id}`);
  }
}
