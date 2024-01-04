import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Injector, inject } from '@angular/core';
import { AuthService } from 'libs/shared/src/lib/services/auth/auth.service';
import { EMPTY_STRING, Method } from '@crown/data';
import { Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);
  private injector = inject(Injector);
  private authService!: AuthService;

  get<T>(url: string, body?: any, headers?: HttpHeaders) {
    return this.makeRequest<T>(Method.GET, url, body, headers);
  }

  post<T>(url: string, body?: any, headers?: HttpHeaders) {
    return this.makeRequest<T>(Method.POST, url, body, headers);
  }

  put<T>(url: string, body?: any, headers?: HttpHeaders) {
    return this.makeRequest<T>(Method.PUT, url, body, headers);
  }

  delete<T>(url: string, body?: any) {
    return this.makeRequest<T>(Method.DELETE, url, body);
  }

  private makeRequest<T>(
    method: Method,
    url: string,
    body?: any,
    headers?: HttpHeaders
  ): Observable<T> {
    console.log(method, url);
    const tokenEmail$ = this.getAuthService().tokenEmail$;
    return tokenEmail$.pipe(
      switchMap((tokenEmail) => {
        const headers = new HttpHeaders({
          Authorization: tokenEmail
            ? `Bearer ${tokenEmail.token}`
            : EMPTY_STRING,
        });
        return this.http.request<T>(method, url, {
          body,
          headers,
          observe: 'body',
        });
      })
    );
  }

  private getAuthService() {
    if (!this.authService) {
      this.authService = this.injector.get(AuthService);
    }
    return this.authService;
  }
}
