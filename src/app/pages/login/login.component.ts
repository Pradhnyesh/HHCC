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
    // console.log('Login Form Data:', this.loginForm);
    
    // Call loginUser method from UserService
    this.userService.loginUser(this.loginForm).subscribe({
      next: (response) => {
        const userData = response.body;
        const responseHeader = response.headers;
        // console.log('Login successful:', responseHeader);
        // console.log('Login successful:', responseHeader.get('Hhcc_id'));
        this.userService.setUserToken(responseHeader.get('Hhcc_id') || '');
        //@ts-ignore
        sessionStorage.setItem('user', userData.email);
        //@ts-ignore
        sessionStorage.setItem('user_Name',  userData.firstName + ' ' + userData.lastName);
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Login failed:', error);
        alert('Login failed. Please check your credentials.');
      }
    });
  }
}
