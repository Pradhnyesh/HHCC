import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    const userName : String = "tejas@gmail.com";
    const password : String = "India@1234";

    // Create base64 encoded credentials for basic auth
    const credentials = btoa(`${userName}:${password}`);

    
    const clonedRequest = request.clone({
          setHeaders: {
            Authorization: `Basic ${credentials}`
          }
    });


    return next.handle(clonedRequest);
  }
}
