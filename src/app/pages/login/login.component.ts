import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm = {
    email: '',
    password: ''
  };

  constructor(private userService: UserService, private router: Router) { }

  onSignIn() {
    console.log('Login Form Data:', this.loginForm);
    
    // Call loginUser method from UserService
    this.userService.loginUser(this.loginForm).subscribe({
      next: (response) => {
        const userData = response; // Assuming response contains user data
        console.log('Login successful:', response);
        //@ts-ignore
        sessionStorage.setItem('user', JSON.stringify(userData.email)); // Store user data in sessionStorage
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Login failed:', error);
        alert('Login failed. Please check your credentials.');
      }
    });
  }
}
