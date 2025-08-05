import { Component } from '@angular/core';

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

  isFormValid(): boolean {
    return this.signupForm.firstName.trim() !== '' &&
           this.signupForm.lastName.trim() !== '' &&
           this.signupForm.email.trim() !== '' &&
           this.signupForm.phone.trim() !== '' &&
           this.signupForm.password.trim() !== '' &&
           this.signupForm.confirmPassword.trim() !== '';
  }

  onCreateAccount() {
    console.log('Create Account button clicked!'); // Debug log
    console.log('Form values:', this.signupForm); // Debug log
    console.log('Is form valid?', this.isFormValid()); // Debug log
    
    if (this.isFormValid()) {
      console.log('Signup Form Data:', this.signupForm);
    } else {
      console.log('Form is invalid - all fields are required');
      alert('Please fill in all fields');
    }
  }
}
