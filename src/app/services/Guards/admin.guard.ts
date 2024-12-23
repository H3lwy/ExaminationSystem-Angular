import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const isLoggedIn = this.authService.isLoggedIn();
    const hasAdminRole = this.authService.hasRole('Admin');

    console.log('Is Logged In:', isLoggedIn);
    console.log('Has Admin Role:', hasAdminRole);

    if (isLoggedIn && hasAdminRole) {
      return true;
    }

    this.router.navigate(['/unauthorized']);
    return false;
  }
}
