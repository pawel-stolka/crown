import { Injectable, inject } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  catchError,
  combineLatest,
  map,
  shareReplay,
  tap,
  throwError,
} from 'rxjs';
import {
  Money,
  API_URL,
  MoneyGroup,
  groupBy,
  fixNumber,
  compareBy,
} from '@crown/data';
import { ApiService } from '@crown/api/service';

@Injectable({
  providedIn: 'root',
})
export class MoneyService {
  private api = inject(ApiService);

  private URL = `${API_URL}/api/money`;

  private _moneySubj = new BehaviorSubject<Money[]>([]);
  private _selectedYearSubj = new BehaviorSubject<number>(0);
  selectedYear$: Observable<number> = this._selectedYearSubj.asObservable();

  money$ = this._moneySubj.asObservable();
  availableYears$ = this.money$.pipe(map(extractYears));
  yearMoney$ = combineLatest([this.money$, this.selectedYear$]).pipe(
    map(([money, year]) => filterByYear(money, year))
  );
  moneyGroups$: Observable<MoneyGroup[]> = this.yearMoney$.pipe(
    map((data: Money[]) => this.groupMoney(data).sort(compareBy('period')))
  );

  get money() {
    return this._moneySubj.value;
  }

  constructor() {
    this.fetchAll$().subscribe();
  }

  fetchAll$() {
    return this.api.get<Money[]>(this.URL).pipe(
      catchError((err) => {
        const message = '[fetchAll] Something wrong...';
        // this.messages.showErrors(message);
        console.log(message, err);
        return throwError(err);
      }),
      // TODO: isDeleted toggle for admin?
      // map((money: Money[]) => money.filter((x) => !x.isDeleted)),
      map((money: Money[]) => money.sort(compareBy('period', false))),
      map((money) => {
        return money.map((m) => ({
          ...m,
          type: m.type?.toLowerCase(),
        }));
      }),
      tap((money: Money[]) => this._moneySubj.next(money))
    );
  }

  create(changes: Partial<Money>) {
    changes = setNoonAsDate(changes);
    console.log('[create | MoneyService]', changes);

    return this.api.post<Money>(this.URL, changes).pipe(
      tap((money) => {
        const update: Money[] = [...this._moneySubj.value, money];
        this._moneySubj.next(update);
      })
    );
  }

  edit(id: string, changes: Partial<Money>) {
    changes = setNoonAsDate(changes);

    const index = this.money.findIndex((money) => money.id === id);
    const newMoney: Money = {
      ...this.money[index],
      ...changes,
    };

    // copy of moneys
    const newMoneys: Money[] = this.money.slice(0);
    newMoneys[index] = newMoney;

    return this.api.put<Money>(`${this.URL}/${id}`, changes).pipe(
      catchError((err) => {
        const message = 'Could not edit money';
        // this.messages.showErrors(message);
        console.log(message, err);
        return throwError(err);
      }),
      tap(() => this._moneySubj.next(newMoneys)),
      shareReplay()
    );
  }

  delete(id: string) {
    return this.api.delete<Money>(`${this.URL}/${id}`).pipe(
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

  changeYear(year: number) {
    this._selectedYearSubj.next(year);
  }

  getCategories$(): Observable<string[]> {
    return this.money$.pipe(
      map((money) =>
        money
          .map((m) => m.type)
          .filter((type): type is string => type !== undefined)
      ),
      map((types) => [...new Set(types)] ?? [])
    );
  }

  // TODO: check options in API
  // _getCategories$() {
  //   const URL = `${API_URL}/api/unique-types-grouped`;
  //   return this.http
  //     .get<{ type: string; count: number }[]>(URL, { headers: this.headers })
  //     .pipe(
  //       catchError((err) => {
  //         const message = '[getCategories] Something wrong...';
  //         // this.messages.showErrors(message);
  //         console.log(message, err);
  //         return throwError(err);
  //       }),
  //       map((countedCats) => countedCats.map((c) => c.type.trim())),
  //       map((c) => [...new Set(c)])
  //     );
  // }

  private groupMoney(data: Money[], by = 'byMonth'): MoneyGroup[] {
    const selection = this.setGrouping(by);
    const groups: any[] = groupBy(data, selection);
    return this.summarize(groups);
  }

  private summarize(moneys: Money[]): MoneyGroup[] {
    return moneys.map((data: any) => {
      const [period, moneyList] = data;
      const typePrices = groupBy(moneyList, (x: any) => x.type)
        .map(([type, price]) => ({
          type,
          price: fixNumber(price.reduce((a: any, c: any) => a + +c.price, 0)),
        }))
        .sort(compareBy('price'));
      const sum = fixNumber(typePrices.reduce((a, c) => a + +c.price, 0));
      return {
        period,
        typePrices,
        sum,
      };
    });
  }

  private setGrouping(by: string) {
    switch (by) {
      case 'byMonth':
        return (x: Money) => getMonth(x.createdAt);
      default:
        throw Error(`Invalid ${by} period`);
    }
  }

  groupAndSortMoney(data: Money[]): MoneyGroup[] {
    if (data !== undefined && data.length) {
      return this.groupMoney(data).sort(compareBy('period'));
    } else {
      return [];
    }
  }
}

function extractYears(money: Money[]): number[] {
  return [...new Set(money.map((m) => getYear(m.createdAt)))].sort();
}

function filterByYear(money: Money[], year: number): Money[] {
  return money.filter(({ createdAt }) => getYear(createdAt) === year);
}

function getMonth(date: Date) {
  return date.toString().substring(0, 7);
}

export function getYear(dateString: string | Date): number {
  let date: Date;

  if (typeof dateString === 'string') {
    date = new Date(dateString);
  } else if (dateString instanceof Date) {
    date = dateString;
  } else {
    throw new Error('Invalid date format');
  }

  // if (isNaN(date.getTime())) {
  //   console.log('Invalid date', dateString);
  // }

  return date.getFullYear();
}

function setNoonAsDate(changes?: Partial<Money>): Partial<Money> {
  const createdAt = changes?.createdAt
    ? new Date(changes?.createdAt)
    : new Date();
  createdAt.setHours(12, 0, 0, 0);

  return {
    ...changes,
    createdAt,
  };
}
