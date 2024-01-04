import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable(/*{
  providedIn: 'root'
}*/)
export class AuthInterceptor implements HttpInterceptor {

  constructor() {console.log('CTOR AuthInterceptor');
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    console.log('AuthInterceptor');

    return next.handle(request);
  }
}
