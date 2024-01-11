import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Injector, inject } from '@angular/core';
import { AuthService } from 'libs/shared/src/lib/services/auth/auth.service';
import { Colors, EMPTY_STRING, Method } from '@crown/data';
import {
  Observable,
  catchError,
  shareReplay,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { ToastService } from '../../toaster/service/toast.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);
  private injector = inject(Injector);
  private authService!: AuthService;
  private toast = inject(ToastService);

  tokenEmail$ = this.getAuthService();

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

    return this.tokenEmail$.pipe(
      switchMap((tokenEmail) => {
        const headers = new HttpHeaders({
          Authorization: tokenEmail
            ? `Bearer ${tokenEmail.token}`
            : EMPTY_STRING,
        });
        return this.http
          .request<T>(method, url, {
            body,
            headers,
            observe: 'body',
          })
          .pipe(
            catchError((err) => {
              const message = 'Coś nie tak...';
              // this.toast.showError('Błąd sieci', message);
              console.log(`%c${message}`, Colors.RED, err);
              return throwError(err);
            })
          );
      })
    );
  }

  private getAuthService() {
    if (!this.authService) {
      this.authService = this.injector.get(AuthService);
    }
    return this.authService.tokenEmail$;
  }
}
