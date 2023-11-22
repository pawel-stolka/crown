import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, switchMap, tap, throwError } from 'rxjs';
import { Money, API_URL } from '@crown/data';
import { AuthService } from 'libs/auth/src/lib/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class MoneyService {
  private URL = `${API_URL}/api/money`;
  private _moneySubj = new BehaviorSubject<Money[]>([]);
  money$ = this._moneySubj.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) {
    console.log('money service CTOR');
    this.data$().subscribe();
  }

  data$() {
    return this.authService.token$.pipe(
      catchError((err) => {
        const message = 'Could not get token';
        // this.messages.showErrors(message);
        console.log(message, err);
        return throwError(err);
      }),
      switchMap(token => this.fetchAll$(token))
    )
  }

  fetchAll$(token: string | null) {
    // TODO: CLEAN IT
    const headers = { Authorization: `Bearer ${token}` };
    console.log('[headers]', headers);

    return this.http
      .get<Money[]>(this.URL, { headers })
      .pipe(
        catchError((err) => {
          const message = 'Something wrong...';
          // this.messages.showErrors(message);
          console.log(message, err);
          return throwError(err);
        }),
        tap((money: Money[]) => this._moneySubj.next(money)));
  }
}
