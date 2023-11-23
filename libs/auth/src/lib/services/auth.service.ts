import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL, AUTH_DATA, AUTH_TOKEN, User } from '@crown/data';
import {
  BehaviorSubject,
  Observable,
  map,
  tap,
  shareReplay,
  catchError,
  throwError,
} from 'rxjs';

export interface TokenEmail {
  token: string;
  email: string;
}

const AUTH_TOKEN_EMAIL = 'AUTH_TOKEN_EMAIL';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _tokenEmailSubj = new BehaviorSubject<TokenEmail | null>(null);
  private _userSubj = new BehaviorSubject<User | null>(null);
  private _tokenSubj = new BehaviorSubject<string | null>(null);

  tokenEmail$: Observable<TokenEmail | null> =
    this._tokenEmailSubj.asObservable();
  user$: Observable<User | null> = this._userSubj.asObservable();
  token$: Observable<string | null> = this._tokenSubj.asObservable();

  isLoggedIn$: Observable<boolean>;
  isLoggedOut$: Observable<boolean>;

  constructor(private http: HttpClient) {
    this.isLoggedIn$ = this.tokenEmail$.pipe(
      tap((te) => console.log('te', te)),
      map((te) => !!te?.token),
      tap((te) => console.log('te2', te)),
    );
    this.isLoggedOut$ = this.isLoggedIn$.pipe(
      // tap((x) => console.log('this.isLoggedOut$', x)),
      map((loggedIn) => !loggedIn)
      // tap((x) => console.log('this.isLoggedOut$ FIN', x)),
    );
    // this.isLoggedIn$ = this.token$.pipe(map((token) => !!token));
    // this.isLoggedOut$ = this.isLoggedIn$.pipe(
    //   // tap((x) => console.log('this.isLoggedOut$', x)),
    //   map((loggedIn) => !loggedIn)
    //   // tap((x) => console.log('this.isLoggedOut$ FIN', x)),
    // );

    const user = localStorage.getItem(AUTH_DATA);
    if (!!user) {
      console.log('auth user', user);
      this._userSubj.next(JSON.parse(user));
    }

    const token = localStorage.getItem(AUTH_TOKEN);
    if (!!token) {
      this._tokenSubj.next(token);
    }
  }

  login(email: string, password: string): Observable<any> {
    const URL = `${API_URL}/signin`;
    return this.http.post<any>(URL, { email, password }).pipe(
      tap((x) => console.log('login', x)),
      catchError((err) => {
        console.log('error', err);
        return throwError(err);
      }),
      tap((res) => {
        // this._userSubj.next(user);
        // localStorage.setItem(AUTH_DATA, JSON.stringify(user));
        // this._tokenSubj.next(res.token);
        // localStorage.setItem(AUTH_TOKEN, res.token); // JSON.stringify(token));
        this._tokenEmailSubj.next(res);
        localStorage.setItem(AUTH_TOKEN_EMAIL, JSON.stringify(res));

        // localStorage.setItem(AUTH_TOKEN, res.token); // JSON.stringify(token));
      }),
      shareReplay()
    );
  }

  logout() {
    // this._userSubj.next(null);
    // localStorage.removeItem(AUTH_DATA);
    this._tokenSubj.next(null);
    localStorage.removeItem(AUTH_TOKEN);
  }
}
