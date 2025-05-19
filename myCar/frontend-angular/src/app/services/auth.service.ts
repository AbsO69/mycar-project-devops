import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private router: Router) {}

  // Method to store the token when the user logs in
  login(token: string): void {
    localStorage.setItem('access_token', token);
  }

  // Method to check if the user is authenticated
  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }

  // Optional: Method to retrieve the token
  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  // Method to log the user out
  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.router.navigate(['/login']);
  }
}
