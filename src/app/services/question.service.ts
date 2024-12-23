import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  private apiUrl = 'https://localhost:7113/api/Question';

  constructor(private http: HttpClient) {}

  getQuestions(pageNumber: number, pageSize: number): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/AllQuestions?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
  }

  getQuestionById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  getQuestionsBySubject(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/GetQuestionsBySubject/${id}`);
  }

  addQuestion(questionData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/AddQuestion`, questionData);
  }

  updateQuestion(id: number, questionData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, questionData);
  }

  deleteQuestion(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
