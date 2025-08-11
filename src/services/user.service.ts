import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  createUser(userData: any) {
    return this.http.post('http://localhost:8080/user/signup', userData, {responseType: 'text'});
  }

  loginUser(loginData: any) : Observable<any> {
    return this.http.post('http://localhost:8080/user/login', loginData, {responseType: 'json'});
  }

  contactUs(contactData: any) {
    return this.http.post('http://localhost:8080/user/contactus', contactData, {responseType: 'text'});
  }

  addFamilyMember(memberData: any) {
    return this.http.post('http://localhost:8080/user/addfamilymember', memberData, {responseType: 'text'});
  }

}
