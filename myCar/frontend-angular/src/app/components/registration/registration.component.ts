import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  standalone: false,
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent {
  username: string = '';
  password: string = '';
  email: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  register(): void {
    const registerData = { username: this.username, password: this.password, email: this.email };

    this.http.post('http://localhost:8000/api/register/', registerData).subscribe({
      next: (response) => {
        this.successMessage = 'Registration successful!';
        this.errorMessage = ''; 
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Registration failed', error);
        this.errorMessage = 'Registration failed. Please try again.';
        this.successMessage = ''; 
      }
    });
  }
}
