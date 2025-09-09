import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from 'src/services/user.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private userService: UserService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    // const userName : String = "tejas@gmail.com";
    // const password : String = "India@1234";

    const userToken = this.userService.getUserToken();

    // // Create base64 encoded credentials for basic auth
    // const credentials = btoa(userToken);

    
    if (userToken) {
      const clonedRequest = request.clone({
          setHeaders: {
            Authorization: `${userToken}`
          }
    });

    return next.handle(clonedRequest);
  }

  return next.handle(request);

  }
}
