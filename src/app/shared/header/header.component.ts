import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  @Input() title: string = '';
  @Input() subtitle?: string;
  @Input() icon?: string;
  @Input() buttons: { label: string; icon: string; action: string }[] = [];
  @Input() iconColor: string = '#007bff';
  @Output() buttonClick = new EventEmitter<string>();

  constructor(private authService: AuthService, private router: Router) {}
  onButtonClick(action: string) {
    if (action === 'dashboard') {
      const role = this.authService.getRole();
      if (role === 'Admin') {
        this.router.navigate(['/admin/dashboard']);
      } else if (role === 'Student') {
        this.router.navigate(['/student/dashboard']);
      } else {
        console.warn(
          'User does not have a valid role for dashboard navigation.'
        );
      }
    } else {
      this.buttonClick.emit(action);
    }
  }
}
