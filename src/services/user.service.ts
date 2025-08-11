import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  createUser(userData: any) {
    return this.http.post('http://localhost:8080/user/signup', userData, {responseType: 'text'});
  }

  loginUser(loginData: any) {
    return this.http.post('http://localhost:8080/user/login', loginData, {responseType: 'text'});
  }

  contactUs(contactData: any) {
    return this.http.post('http://localhost:8080/user/contactus', contactData, {responseType: 'text'});
  }

}
