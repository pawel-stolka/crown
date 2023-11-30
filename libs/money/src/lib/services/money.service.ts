import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  catchError,
  filter,
  map,
  of,
  shareReplay,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { Money, API_URL, MoneyGroup, TokenEmail, Colors } from '@crown/data';
import { AuthService } from 'libs/auth/src/lib/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class MoneyService {
  private URL = `${API_URL}/api/money`;
  private _moneySubj = new BehaviorSubject<Money[]>([]);
  money$ = this._moneySubj.asObservable();
  moneyGroups$: Observable<MoneyGroup[]> = this.money$.pipe(
    map((data: Money[]) => this.groupMoney(data).sort(compareBy('period')))
  );
  headers!: { Authorization: string };
  tokenEmail: TokenEmail | null = null;

  get money() {
    return this._moneySubj.value;
  }

  constructor(private http: HttpClient, private authService: AuthService) {
    console.log('money service CTOR');
    this.data$().subscribe();
  }

  data$() {
    return this.authService.tokenEmail$.pipe(
      catchError((err) => {
        const message = 'Could not get token';
        // this.messages.showErrors(message);
        console.log(message, err);
        return throwError(err);
      }),
      filter((x) => !!x),
      tap((tokenEmail) => (this.tokenEmail = tokenEmail)),
      switchMap((tokenEmail) => {
        if (tokenEmail?.token) {
          return this.fetchAll$(tokenEmail.token);
        } else {
          return of(null);
        }
      })
    );
  }

  fetchAll$(token: string | null) {
    // TODO: CLEAN IT
    this.headers = { Authorization: `Bearer ${token}` };

    return this.http.get<Money[]>(this.URL, { headers: this.headers }).pipe(
      catchError((err) => {
        const message = '[fetchAll] Something wrong...';
        // this.messages.showErrors(message);
        console.log(message, err);
        return throwError(err);
      }),
      map((money: Money[]) => money.sort(compareBy('period', false))),
      tap((money: Money[]) => this._moneySubj.next(money))
    );
  }

  getCategories$() {
    const URL = `${API_URL}/api/unique-types-grouped`;
    return this.http
      .get<{ type: string; count: number }[]>(URL, { headers: this.headers })
      .pipe(
        catchError((err) => {
          const message = '[getCategories] Something wrong...';
          // this.messages.showErrors(message);
          console.log(message, err);
          return throwError(err);
        }),
        map((countedCats) =>
          countedCats.map((c) => c.type.trim().toLowerCase())
        ),
        map((c) => [...new Set(c)])
      );
  }

  create(changes?: Partial<Money>) {
    return this.http
      .post<Money>(this.URL, changes, { headers: this.headers })
      .pipe(
        tap((money) => {
          console.log('created', money);
          const update: Money[] = [...this._moneySubj.value, money];
          this._moneySubj.next(update);
        })
      );
  }

  edit(id: string, changes: Partial<Money>) {
    const index = this.money.findIndex((money) => money.id === id);
    const newMoney: Money = {
      ...this.money[index],
      ...changes,
    };

    // copy of moneys
    const newMoneys: Money[] = this.money.slice(0);
    newMoneys[index] = newMoney;
    this._moneySubj.next(newMoneys);

    return this.http
      .put<Money>(`${this.URL}/${id}`, changes, { headers: this.headers })
      .pipe(
        catchError((err) => {
          const message = 'Could not edit money';
          // this.messages.showErrors(message);
          console.log(message, err);
          return throwError(err);
        }),
        tap((x) => console.log('EDIT result', x)),
        shareReplay()
      );
  }

  delete(id: string) {
    return this.http
      .delete<Money>(`${this.URL}/${id}`, { headers: this.headers })
      .pipe(
        catchError((err) => {
          const message = '[delete] Something wrong...';
          // this.messages.showErrors(message);
          console.log(message, err);
          return throwError(err);
        }),
        tap((money: Money) => {
          const newMoneyList = this.money.filter((x) => x.id !== money.id);
          this._moneySubj.next(newMoneyList);
        })
      );
  }

  private groupMoney(data: Money[], by = 'byMonth'): MoneyGroup[] {
    const selection = this.setGrouping(by, data);
    const groups: any[] = groupBy(data, selection);
    return this.summarize(groups);
  }

  private summarize(moneys: Money[]): MoneyGroup[] {
    return moneys.map((data: any) => {
      const [period, moneyList] = data;
      const typePrices = groupBy(moneyList, (x: any) => x.type)
        .map(([type, price]) => ({
          type,//: x[0],
          price: fixNumber(price.reduce((a: any, c: any) => a + +c.price, 0)),
        }))
        .sort(compareBy('price'));
      const sum = fixNumber(typePrices.reduce((a, c) => a + +c.price, 0));
      return {
        userId: 'not-yet',
        period,
        typePrices,
        sum,
      };
    });
  }

  private setGrouping(by: string, data: Money[]) {
    switch (by) {
      // case 'byDay':
      //   return (x: Money) => getDay(x.createdAt);
      // case 'byWeek':
      //   return (x: Money) => getWeek(x.createdAt);
      case 'byMonth':
        return (x: Money) => getMonth(x.createdAt);
      default:
        throw Error(`Invalid ${by} period`);
    }
  }
}

function getMonth(date: Date) {
  return date.toString().substring(0, 7);
}

function groupBy(list: any[], prop: any) {
  const map = new Map();
  list.forEach((item) => {
    const key = prop(item);
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });
  return Array.from(map);
}

function fixNumber(num: number): number {
  return +num.toFixed(2);
}

export function compareBy(prop?: string, descending = false) {
  const order = descending ? -1 : 1;
  return function (a: any, b: any) {
    const lowA = a.toString().toLowerCase();
    const lowB = b.toString().toLowerCase();
    if (!!prop) return order * (a[prop] <= b[prop] ? 1 : -1);
    else return order * (lowA <= lowB ? 1 : -1);
  };
}
