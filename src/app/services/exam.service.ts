import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExamService {
  private apiUrl = 'https://localhost:7113/api/Exam';

  constructor(private http: HttpClient) {}

  getExams(pageNumber: number = 1, pageSize: number = 10): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/AllExams?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
  }

  getExamById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/GetExamById/${id}`);
  }

  addExam(examDto: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/AddExam`, examDto);
  }

  editExam(id: number, examData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/EditExam/${id}`, examData);
  }

  deleteExam(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/DeleteExam/${id}`);
  }
}
