import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable, Injector, inject } from '@angular/core';
import { AuthService } from '@crown/auth/service';
import { AUTH_TOKEN_EMAIL, EMPTY_STRING } from '@crown/data';
import {
  Observable,
  catchError,
  shareReplay,
  switchMap,
  tap,
  throwError,
} from 'rxjs';

enum Method {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private http = inject(HttpClient);
  private injector = inject(Injector);
  private authService!: AuthService;

  private getAuthService() {
    if (!this.authService) {
      this.authService = this.injector.get(AuthService);
    }
    return this.authService;
  }

  // login(url: string, email: string, password: string) {
  //   return this.post(url, { email, password }).pipe(
  //     catchError((err) => {
  //       console.log('[Error]', err);
  //       return throwError(() => new Error('[Error]'));
  //     }),
  //     // tap((res) => {
  //     //   this._tokenEmailSubj.next(res);
  //     //   localStorage.setItem(AUTH_TOKEN_EMAIL, JSON.stringify(res));
  //     // }),
  //     shareReplay()
  //   );
  // }

  get<T>(url: string, body?: any, headers?: HttpHeaders) {
    console.log('GET', url);
    return this.makeRequest<T>(Method.GET, url, body, headers);
  }

  post<T>(url: string, body?: any, headers?: HttpHeaders) {
    console.log('POST', url);

    return this.makeRequest<T>(Method.POST, url, body, headers);
  }

  private makeRequest<T>(
    method: Method,
    url: string,
    body?: any,
    headers?: HttpHeaders
  ): Observable<T> {
    // using AuthService
    /*const tokenEmail$ = this.getAuthService().tokenEmail$;
    return tokenEmail$.pipe(
      switchMap((tokenEmail) => {
        const headers = new HttpHeaders({
          Authorization: tokenEmail
            ? `Bearer ${tokenEmail.token}`
            : EMPTY_STRING,
        });
        return this.http.request<T>(method, url, {body, headers, observe: 'body'})
      })
    );*/

    /* manual */
    const token = this.retrieveAuthToken();
    const customHeaders = token
      ? headers ||
        new HttpHeaders({
          Authorization: `Bearer ${token}`,
        })
      : new HttpHeaders();

    // Make the HTTP request
    return this.http.request<T>(method, url, {
      body,
      headers: customHeaders,
      // TODO: check if there's need for Observable<HttpResponse<T>>
      // observe: 'response',
      observe: 'body',
    });
    /**/
  }

  private retrieveAuthToken(): string | null {
    let tokenEmail = localStorage.getItem(AUTH_TOKEN_EMAIL);
    return !!tokenEmail ? JSON.parse(tokenEmail).token : EMPTY_STRING;
  }
}
