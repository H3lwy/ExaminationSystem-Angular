import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  message: string | null = null;
  error: string | null = null;
  showConfirmationModal: boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthService,private router: Router) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  get email() {
    return this.forgotPasswordForm.get('email');
  }

  onSubmit(): void {
    this.authService.forgotPassword(this.forgotPasswordForm.value).subscribe({
        next: (response) => {
            this.message = response.errors[0];
            this.error = null;
            this.showConfirmationModal = true;
        },
        error: (err) => {
            this.error = err.error?.errors?.[0] || 'An error occurred. Please try again.';
            this.message = null;
        },
    });
}

goToLogin(): void {
    this.router.navigate(['/login']);
}
}
