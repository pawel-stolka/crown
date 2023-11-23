import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  catchError,
  filter,
  map,
  of,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { Money, API_URL, MoneyGroup } from '@crown/data';
import { AuthService } from 'libs/auth/src/lib/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class MoneyService {
  private URL = `${API_URL}/api/money`;
  private _moneySubj = new BehaviorSubject<Money[]>([]);
  money$ = this._moneySubj.asObservable();
  moneyGroups$: Observable<MoneyGroup[]> = this.money$.pipe(
    // moneyGroups$: Observable<any[]> = this.money$.pipe(
    map((data: Money[]) => this.groupMoney(data).sort(compareBy('period'))),
    tap((moneyGroups: MoneyGroup[]) =>
      console.log('--moneyGroups--', moneyGroups)
    )
  );
  headers!: { Authorization: string };

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
    console.log('[headers]', this.headers);

    return this.http.get<Money[]>(this.URL, { headers: this.headers }).pipe(
      catchError((err) => {
        const message = 'Something wrong...';
        // this.messages.showErrors(message);
        console.log(message, err);
        return throwError(err);
      }),
      tap((money: Money[]) => this._moneySubj.next(money))
    );
  }

  create(changes?: Partial<Money>) {
    // console.log('create changes', changes);
    return this.http
      .post<Money>(this.URL, changes, { headers: this.headers })
      .pipe(
        tap((money) => {
          const update: Money[] = [...this._moneySubj.value, money];
          this._moneySubj.next(update);
        })
      );
  }

  private groupMoney(data: Money[], by = 'byMonth'): MoneyGroup[] {
    const selection = this.setGrouping(by, data);
    const groups: any[] = groupBy(data, selection);
    return this.summarize(groups);
  }

  private summarize(moneys: Money[]): MoneyGroup[] {
    // console.log('summarize', moneys);
    return moneys.map((data: any) => {
      const [period, moneyList] = data;
      const typePrices = groupBy(moneyList, (x: any) => x.type)
        .map((x) => ({
          type: x[0],
          price: fixNumber(x[1].reduce((a: any, c: any) => a + +c.price, 0)),
        }))
        .sort(compareBy('price'));
      const sum = fixNumber(typePrices.reduce((a, c) => a + +c.price, 0));
      return {
        userId: 'not-yet',
        period,
        // moneyList,
        typePrices,
        sum,

        // id: 'id',
        // price: 'price',
        // fromWho: 'fromWho',
        // createdAt: 'createdAt'
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
  let res = date.toString().substring(0, 7);
  // console.log('getMonth', res, date);

  return res;
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
