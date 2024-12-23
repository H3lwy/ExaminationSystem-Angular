import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private apiUrl = 'https://localhost:7113/api';

  constructor(private http: HttpClient) {}

  getAllStudentsNumbers(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/Admin/AllStudentsNumbers`);
  }

  getCompletedExamsNumbers(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/Admin/CompletedExamsNumbers`);
  }

  getPassedExamsNumbers(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/Admin/PassedExamsNumbers`);
  }

  getFailedExamsNumbers(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/Admin/FailedExamsNumbers`);
  }

  getStudents(pageNumber: number, pageSize: number): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/Admin/AllStudents?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
  }

  updateStudentStatus(studentId: string, isActive: boolean): Observable<any> {
    const url = `${this.apiUrl}/Admin/${studentId}/status`;
    const payload = { isActive };
    return this.http.put(url, payload);
  }
}
