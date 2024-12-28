import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css'],
})
export class ResetPasswordComponent {
  resetData = {
    email: '',
    token: '',
    newPassword: '',
    confirmPassword: '',
  };
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.resetData.email = this.route.snapshot.queryParamMap.get('email') || '';
    this.resetData.token = this.route.snapshot.queryParamMap.get('token') || '';

    if (!this.resetData.email || !this.resetData.token) {
      this.errorMessage = 'Invalid or missing reset token.';
    }
  }

  onSubmit(): void {
    if (this.resetData.newPassword !== this.resetData.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    this.authService.resetPassword(this.resetData).subscribe({
      next: (response) => {
        if (response.result) {
          this.successMessage = 'Password reset successful. Redirecting to login...';
          setTimeout(() => this.router.navigate(['/login']), 3000);
        } else {
          this.errorMessage = response.errors.join(', ');
        }
      },
      error: (error) => {
        this.errorMessage = error.error?.errors?.join(', ') || 'Password reset failed. Please try again.';
      },
    });
  }
}
