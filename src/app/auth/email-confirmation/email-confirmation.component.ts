import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-email-confirmation',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './email-confirmation.component.html',
  styleUrl: './email-confirmation.component.css'
})
export class EmailConfirmationComponent implements OnInit {
  email: string | null = null;
  token: string | null = null;
  message: string = '';
  errorMessage: string = '';
  actionType: 'Send' | 'Confirm' = 'Confirm'; // Default to confirmation

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Extract email and token from query parameters
    this.email = this.route.snapshot.queryParamMap.get('email');
    this.token = this.route.snapshot.queryParamMap.get('token');
    console.log('Extracted email:', this.email, 'Token:', this.token);

    if (this.token) {
      this.actionType = 'Confirm';
      this.confirmEmail();
    }
  }

  confirmEmail(): void {
    if (!this.email || !this.token) {
      this.errorMessage = 'Invalid email or token.';
      return;
    }

    this.authService.confirmEmail({ email: this.email, token: this.token }).subscribe({
      next: (response) => {
        this.message = response.errors?.[0] || 'Email confirmed successfully!';
        console.log('Email confirmation successful:', response);
      },
      error: (error) => {
        this.errorMessage = error.error.errors?.[0] || 'Failed to confirm email.';
        console.error('Error confirming email:', error);
      },
    });
  }

  resendEmail(): void {
    if (!this.email) {
      this.errorMessage = 'Email is required to resend confirmation.';
      return;
    }

    this.authService.sendConfirmationEmail(this.email).subscribe({
      next: (response) => {
        this.message = response.errors?.[0] || 'Confirmation email sent successfully!';
        console.log('Email resent successfully:', response);
      },
      error: (error) => {
        this.errorMessage = error.error.errors?.[0] || 'Failed to resend email.';
        console.error('Error resending email:', error);
      },
    });
  }
}