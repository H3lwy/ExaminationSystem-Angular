import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginData = {
    email: '',
    password: '',
  };

  errorMessage: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  onLogin() {
    const credentials = {
      email: this.loginData.email,
      password: this.loginData.password,
    };

    this.authService.login(credentials).subscribe({
      next: (response) => {
        this.authService.storeToken(response.token);

        const payload = this.authService.getUserInfo();
        console.log('Token Payload:', payload);

        const userRole = payload?.role;
        console.log('User Role:', userRole);

        if (userRole === 'Admin') {
          this.router.navigate(['/admin/dashboard']);
        } else if (userRole === 'Student') {
          this.router.navigate(['/student/dashboard']);
        } else {
          this.router.navigate(['/unauthorized']);
        }
      },
      error: (error) => {
        console.error('Login Error:', error);

        if (error.status === 403) {
          this.errorMessage = 'Account is locked. Please contact support.';
        } else if (error.status === 401 ) {
          this.errorMessage = 'Your email is not confirmed. Please check your email to confirm your account.';
        } else if (error.status === 400) {
          this.errorMessage = 'Email or password is incorrect. Please try again.';
        }else{
          this.errorMessage = 'An unexpected error occurred. Please try again later.';
        }       
      },
    });
  }
}
