import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userToken: string = '';

  public setUserToken(token: string) {
    this.userToken = token;
  }

  public getUserToken(): string {
    return this.userToken;
  }

  constructor(private http: HttpClient) { }

  createUser(userData: any) {
    return this.http.post('http://localhost:8080/user/signup', userData, {responseType: 'text'});
  }

  loginUser(loginData: any) : Observable<any> {
    return this.http.post('http://localhost:8080/user/login', loginData, {responseType: 'json', observe: 'response'});
  }

  contactUs(contactData: any) {
    return this.http.post('http://localhost:8080/user/contactus', contactData, {responseType: 'text'});
  }

  addFamilyMember(memberData: any) {
    return this.http.post('http://localhost:8080/user/addfamilymember', memberData, {responseType: 'text'});
  }

  addPet(petData: any) {
    return this.http.post('http://localhost:8080/user/addpet', petData, {responseType: 'text'});
  }

  getFamilyMembers(): Observable<any> {
    return this.http.get(`http://localhost:8080/user/getfamilymembers?userEmail=${sessionStorage.getItem('user')}`, {responseType: 'json'});
  }

  getPetMembers(): Observable<any> {
    return this.http.get(`http://localhost:8080/user/getpetmembers?userEmail=${sessionStorage.getItem('user')}`, {responseType: 'json'});
  }

  removeMember(memberId: number): Observable<any> {
    return this.http.delete(`http://localhost:8080/user/removemember/${memberId}`, {responseType: 'text'});
  }

  updateFamilyMember(memberData: any): Observable<any> {
    return this.http.put(`http://localhost:8080/user/updatefamilymember`, memberData, {responseType: 'text'});
  }

  removePet(petId: number): Observable<any> {
    return this.http.delete(`http://localhost:8080/user/removepet/${petId}`, {responseType: 'text'});
  }

  updatePet(petData: any): Observable<any> {
    return this.http.put(`http://localhost:8080/user/updatepet`, petData, {responseType: 'text'});
  }

  bookAppointment(appointmentData: any): Observable<any> {
    return this.http.post('http://localhost:8080/user/fixappointment', appointmentData, {responseType: 'text'});
  }

  getBookedAppointments(): Observable<any> {
    return this.http.get(`http://localhost:8080/user/getappointment/${sessionStorage.getItem('user')}`, {responseType: 'json'});
  }
}
