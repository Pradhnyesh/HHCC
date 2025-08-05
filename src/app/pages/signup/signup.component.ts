import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signupForm = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  };

  constructor(private userService: UserService, private router: Router) { }

  isFormValid(): boolean {
    return this.signupForm.firstName.trim() !== '' &&
           this.signupForm.lastName.trim() !== '' &&
           this.signupForm.email.trim() !== '' &&
           this.signupForm.phone.trim() !== '' &&
           this.signupForm.password.trim() !== '' &&
           this.signupForm.confirmPassword.trim() !== '' &&
           this.signupForm.password === this.signupForm.confirmPassword;
  }

  passwordsMatch(): boolean {
    return this.signupForm.password === this.signupForm.confirmPassword;
  }

  clearForm() {
    this.signupForm = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: ''
    };
  }

  onCreateAccount() {
    if (!this.isFormValid()) {
      if (this.signupForm.firstName.trim() === '' ||
          this.signupForm.lastName.trim() === '' ||
          this.signupForm.email.trim() === '' ||
          this.signupForm.phone.trim() === '' ||
          this.signupForm.password.trim() === '' ||
          this.signupForm.confirmPassword.trim() === '') {
        alert('Please fill in all fields');
      } else if (!this.passwordsMatch()) {
        alert('Passwords do not match. Please make sure both password fields are identical.');
      }
    } else {
      console.log('Signup Form Data:', this.signupForm);
      
      // Call createUser method from UserService
      this.userService.createUser(this.signupForm).subscribe({
        next: (response) => {
          console.log('User created successfully:', response);
          alert('Account created successfully!');
          this.clearForm(); // Clear the form
          this.router.navigate(['/login']); // Navigate to login page
        },
        error: (error) => {
          console.error('Error creating user:', error);
          alert('Error creating account. Please try again.');
        }
      });
    }
  }
}
