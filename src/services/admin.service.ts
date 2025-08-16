import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http : HttpClient) { }

  getAllTours(): Observable<any> {
    return this.http.get('http://localhost:8080/admin/getBookedTours', { responseType: 'json' });
  }

  updateTourStatus(tourId: number, status: string): Observable<any> {
    return this.http.patch(`http://localhost:8080/admin/updateBookedTour/${tourId}`, { status }, { responseType: 'text' });
  }

}
