import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { Money, MoneyURL as URL } from "@crown/data";

@Injectable({
  providedIn: 'root'
})
export class MoneyService {
  private _moneySubj = new BehaviorSubject<Money[]>([]);
  money$ = this._moneySubj.asObservable();

  constructor(private http: HttpClient) {
    console.log('money service CTOR');
    this.fetchAll$().subscribe();
  }

  fetchAll$() {
    let bearer = 'Bearer ...'
    const headers = { 'Authorization': bearer }
    return this.http
      .get<Money[]>(URL, { headers })
      .pipe(tap((money: Money[]) => this._moneySubj.next(money)));
  }
}
