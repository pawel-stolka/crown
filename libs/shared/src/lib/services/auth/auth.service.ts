import { ApiService } from 'libs/shared/src/lib/services/api/api.service';
import { Injectable, Injector } from '@angular/core';
import { API_URL, AUTH_TOKEN_EMAIL, TokenEmail } from '@crown/data';
import { BehaviorSubject, Observable, map, tap, take } from 'rxjs';

const TEMP_ADMIN_FLAG = true;
                           @Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiService!: ApiService;

  private _tokenEmailSubj = new BehaviorSubject<TokenEmail | null>(null);
  private _isAdminSubj = new BehaviorSubject<boolean>(TEMP_ADMIN_FLAG);

  tokenEmail$: Observable<TokenEmail | null> =
    this._tokenEmailSubj.asObservable();
  isAdmin$: Observable<boolean> = this._isAdminSubj.asObservable();

  isLoggedIn$ = this.tokenEmail$.pipe(map((val) => !!val?.token));
  isLoggedOut$ = this.isLoggedIn$.pipe(map((loggedIn) => !loggedIn));

  constructor(private injector: Injector) {
    const token = localStorage.getItem(AUTH_TOKEN_EMAIL);
    if (!!token) {
      this._tokenEmailSubj.next(JSON.parse(token));
    }
  }

  login(email: string, password: string): Observable<any> {
    const URL = `${API_URL}/signin`;
    return this.getApiService()
      .post(URL, { email, password })
      .pipe(
        take(1),
        tap((res) => {
          this._tokenEmailSubj.next(res);

          localStorage.setItem(AUTH_TOKEN_EMAIL, JSON.stringify(res));
        })
        // shareReplay()
      );
  }

  logout() {
    this._tokenEmailSubj.next(null);
    localStorage.removeItem(AUTH_TOKEN_EMAIL);
  }

  private getApiService() {
    if (!this.apiService) {
      this.apiService = this.injector.get(ApiService);
    }
    return this.apiService;
  }
}
