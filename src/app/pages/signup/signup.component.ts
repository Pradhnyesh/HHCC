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
           this.signupForm.confirmPassword.trim() !== '' &&
           this.signupForm.password === this.signupForm.confirmPassword;
  }

  passwordsMatch(): boolean {
    return this.signupForm.password === this.signupForm.confirmPassword;
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
    }
  }
}
