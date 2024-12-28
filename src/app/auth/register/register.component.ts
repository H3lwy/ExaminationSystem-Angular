import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  registerData = {
    firstName: '',
    lastName: '',
    email: '',
    userName: '',
    password: '',
    confirmPassword: '',
  };
  errorMessage: string | null = null;
  showConfirmationModal: boolean = false;
  hasMinLength: boolean = false;
  hasUpperCase: boolean = false;
  hasLowerCase: boolean = false;
  hasNumber: boolean = false;
  hasSpecialChar: boolean = false;
  showPasswordRequirements: boolean = false;
  emailInUse = false;
  userNameInUse = false;
  checkingEmail = false;
  checkingUserName = false;
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  onEmailBlur() {
    if (!this.registerData.email) return;
    this.checkingEmail = true;
    this.authService
      .checkUserAvailability(this.registerData.email, null)
      .subscribe({
        next: (res) => {
          this.checkingEmail = false;
          this.emailInUse = res.emailExists;
        },
        error: (err) => {
          this.checkingEmail = false;
          console.error('Failed to check email availability:', err);
        }
      });
  }

  onUserNameBlur() {
    if (!this.registerData.userName) return;
    this.checkingUserName = true;
    this.authService
      .checkUserAvailability(null, this.registerData.userName)
      .subscribe({
        next: (res) => {
          this.checkingUserName = false;
          this.userNameInUse = res.userNameExists;
        },
        error: (err) => {
          this.checkingUserName = false;
          console.error('Failed to check username availability:', err);
        }
      });
  }

  checkPasswordStrength() {
    const password = this.registerData.password;
    
    this.hasMinLength = password.length >= 6;
    this.hasUpperCase = /[A-Z]/.test(password);
    this.hasLowerCase = /[a-z]/.test(password);
    this.hasNumber = /\d/.test(password);
    this.hasSpecialChar = /[!@#$%^&*]/.test(password);
}

isPasswordValid(): boolean {
    return this.hasMinLength && 
           this.hasUpperCase && 
           this.hasLowerCase && 
           this.hasNumber && 
           this.hasSpecialChar;
}

  onSubmit() {
    if (!this.isPasswordValid()) {
      this.errorMessage = 'Please meet all password requirements';
      return;
  }
    this.authService.register(this.registerData).subscribe({
        next: () => {
            this.showConfirmationModal = true;
        },
        error: (error) => {
            this.errorMessage = error.error?.errors?.join(', ') || 'Registration failed';
        }
    });
}

  closeModal(): void {
    this.showConfirmationModal = false;
}
}
