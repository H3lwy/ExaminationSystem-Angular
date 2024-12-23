import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://localhost:7113/api/Account';
  private tokenExpirationTimer: any;
  constructor(private http: HttpClient, private router: Router) {}

  login(data: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, JSON.stringify(data), {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }

  register(data: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/Register`, JSON.stringify(data), {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }

  storeToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  clearToken(): void {
    localStorage.removeItem('authToken');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  hasRole(role: string): boolean {
    const token = this.getToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const roles = payload.role || payload.roles;
        if (Array.isArray(roles)) {
          return roles.includes(role);
        } else if (typeof roles === 'string') {
          return roles === role;
        }
        return false;
      } catch (error) {
        console.error('Error parsing token:', error);
        return false;
      }
    }
    console.warn('No token found');
    return false;
  }

  getRole(): string | null {
    const token = this.getToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.role || null;
      } catch (error) {
        console.error('Error parsing token:', error);
        return null;
      }
    }
    return null;
  }

  getStudentId(): number | null {
    const token = this.getToken();
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.StudentId || null;
    }
    return null;
  }

  isTokenValid(): boolean {
    const token = this.getToken();
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp > currentTime;
    }
    return false;
  }

  getUserName(): string | null {
    const token = this.getToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('Token Payload:', payload);
        const firstName = payload.FirstName || payload['FirstName'];
        const lastName = payload.LastName || payload['LastName'];
        if (firstName && lastName) {
          return `${firstName} ${lastName}`;
        }
        return (
          payload.name ||
          payload.email ||
          payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name']
        );
      } catch (error) {
        console.error('Error parsing token:', error);
        return null;
      }
    }
    return null;
  }

  getUserInfo(): any {
    const token = this.getToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('Token Payload:', payload);
        return payload;
      } catch (error) {
        console.error('Error parsing token:', error);
        return null;
      }
    }
    console.error('Token is missing');
    return null;
  }

  setTokenAutoLogout(): void {
    const token = this.getToken();
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = payload.exp * 1000;
      const timeRemaining = expirationTime - Date.now();

      if (timeRemaining > 0) {
        this.tokenExpirationTimer = setTimeout(() => {
          this.logout().subscribe(() => {
            alert('Your session has expired. Please log in again.');
            this.router.navigate(['/login']);
          });
        }, timeRemaining);
      } else {
        this.logout().subscribe(() => {
          alert('Your session has expired. Please log in again.');
          this.router.navigate(['/login']);
        });
      }
    }
  }

  clearTokenAutoLogout(): void {
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null;
    }
  }

  logout(): Observable<any> {
    this.clearTokenAutoLogout();
    return new Observable((observer) => {
      this.clearToken();
      this.router.navigate(['/login']);
      observer.next(true);
      observer.complete();
    });
  }
}
