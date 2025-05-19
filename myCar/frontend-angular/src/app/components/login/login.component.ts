import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';  // Import AuthService

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  error: string = '';

  constructor(
    private http: HttpClient, 
    private router: Router,
    private authService: AuthService 
  ) {}

  login() {
    const loginData = { username: this.username, password: this.password };

  
    this.http.post('http://localhost:8000/api/token/', loginData) // django frame work, fiya built in login path la tjib l token, mnaamela install via cmd pip install djangorestframework-simplejwt
      .subscribe({
        next: (response: any) => {
          this.authService.login(response.access);
          localStorage.setItem('refresh_token', response.refresh);
          this.router.navigate(['/cars']);
        },
        error: (err) => {
          this.error = 'Invalid login credentials';  
          console.error(err);
        }
      });
  }
}
