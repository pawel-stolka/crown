import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL, AUTH_DATA, User } from '@crown/data';
import { BehaviorSubject, Observable, map, tap, shareReplay, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // URL = API_URL
  private _userSubj = new BehaviorSubject<User | null>(null);

  user$: Observable<User | null> = this._userSubj.asObservable();

  isLoggedIn$: Observable<boolean>;
  isLoggedOut$: Observable<boolean>;

  constructor(private http: HttpClient) {
    this.isLoggedIn$ = this.user$.pipe(map((user) => !!user));
    this.isLoggedOut$ = this.isLoggedIn$.pipe(
      // tap((x) => console.log('this.isLoggedOut$', x)),
      map((loggedIn) => !loggedIn),
      // tap((x) => console.log('this.isLoggedOut$ FIN', x)),
    );

    const user = localStorage.getItem(AUTH_DATA);

    if (!!user) {
      console.log('auth user', user);
      this._userSubj.next(JSON.parse(user));
    }
  }

  login(email: string, password: string): Observable<User> {
    const URL = `${API_URL}/signin`
    return this.http.post<User>(URL, { email, password }).pipe(
      tap(x => console.log('login', x)
      ),
      catchError((err) => {
        console.log('error', err);

        return throwError(err);
      }),
      tap((user) => {
        this._userSubj.next(user);
        localStorage.setItem(AUTH_DATA, JSON.stringify(user));
      }),
      shareReplay()
    );
  }

  logout() {
    this._userSubj.next(null);

    localStorage.removeItem(AUTH_DATA);
  }
}
