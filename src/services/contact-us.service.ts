import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ContactUsService {

  constructor(private http: HttpClient) { }

  submitContactForm(formData: any) {
    return this.http.post('http://localhost:8080/contactus/getintouch', formData, {responseType : 'text'});
  }
}
