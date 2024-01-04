// import { HttpClient } from '@angular/common/http';
import { HttpService } from '@crown/http';
import { Injectable, inject } from '@angular/core';
import {
  ACCESS_ROLE,
  API_URL,
  AUTH_TOKEN_EMAIL,
  TokenEmail,
} from '@crown/data';
import {
  BehaviorSubject,
  Observable,
  map,
  tap,
  shareReplay,
  catchError,
  throwError,
  of,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpService);

  private _tokenEmailSubj = new BehaviorSubject<TokenEmail | null>(null);
  private _isAdminSubj = new BehaviorSubject<boolean>(true);

  tokenEmail$: Observable<TokenEmail | null> =
    this._tokenEmailSubj.asObservable();
  isAdmin$: Observable<boolean> = this._isAdminSubj.asObservable();

  isLoggedIn$ = this.tokenEmail$.pipe(map((val) => !!val?.token));
  isLoggedOut$ = this.isLoggedIn$.pipe(map((loggedIn) => !loggedIn));

  constructor() {
    const token = localStorage.getItem(AUTH_TOKEN_EMAIL);
    if (!!token) {
      this._tokenEmailSubj.next(JSON.parse(token));
    }
  }

  // TODO: DELETE
  getToken() {
    return this._tokenEmailSubj.value;
  }

  login(email: string, password: string): Observable<any> {
    const URL = `${API_URL}/signin`;
    return this.http.post<any>(URL, { email, password }).pipe(
      tap((res) => {
        this._tokenEmailSubj.next(res);
        localStorage.setItem(AUTH_TOKEN_EMAIL, JSON.stringify(res));
      }),
      shareReplay()
    );
  }

  logout() {
    this._tokenEmailSubj.next(null);
    localStorage.removeItem(AUTH_TOKEN_EMAIL);
  }
}
