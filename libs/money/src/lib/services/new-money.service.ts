import { Injectable, inject } from '@angular/core';
import { ApiService } from '@crown/api/service';
import {
  API_URL,
  Colors,
  EMPTY_STRING,
  Money,
  MoneyFilter,
  MoneyGroup,
  compareBy,
  fixNumber,
  groupBy,
  setNoonAsDate,
} from '@crown/data';
import {
  BehaviorSubject,
  Observable,
  catchError,
  combineLatest,
  map,
  of,
  shareReplay,
  switchMap,
  tap,
  throwError,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NewMoneyService {

  private api = inject(ApiService);
  private URL = `${API_URL}/api/money`;
  private _moneySubj = new BehaviorSubject<Money[]>([]);

  money$ = this._moneySubj.asObservable();

  private _filterSubj: BehaviorSubject<MoneyFilter> =
    new BehaviorSubject<MoneyFilter>({});
  filters$ = this._filterSubj.asObservable();

  get money() {
    return this._moneySubj.value;
  }

  get filters() {
    return this._filterSubj.value;
  }

  allYears$ = this.money$.pipe(
    map((money) => [
      ...new Set(money.map((m) => new Date(m.createdAt).getFullYear()).sort()),
    ])
  );
  defaultYear$ = this.allYears$;

  private _messageSubj = new BehaviorSubject(EMPTY_STRING);
  message$: Observable<string> = this._messageSubj.asObservable();

  updateMessage(message: string) {
    this._messageSubj.next(message);
  }

  addYearFilter(year: number) {
    const update: MoneyFilter = {
      ...this.filters,
      year,
    };
    this.updateFilters(update);
  }

  updateFilters(filter: MoneyFilter) {
    this._filterSubj.next(filter);
    // this.updateMessage(`wynik`);
  }

  resetFilters() {
    const update: MoneyFilter = {
      ...this.filters,
      type: undefined,
      year: undefined,
      startDate: undefined,
      endDate: undefined,
    };
    this.updateFilters(update);
  }



  filteredMoney$: Observable<Money[]> = combineLatest([
    this.money$,
    this.filters$,
  ]).pipe(map(([data, filters]) => this.filterMoney(data, filters)));

  constructor() {
    // this.fetchAll$().subscribe();
    this.initializeDataFetch().subscribe();
  }

  private initializeDataFetch() {
    return this.api.tokenEmail$.pipe(
      switchMap((tokenEmail) => {
        if (tokenEmail) {
          return this.fetchAll$(); // Call your data fetching method
        } else {
          return of([]);
          // Optionally handle the case when the user logs out
        }
      }),
      shareReplay()
    );
  }

  fetchAll$() {
    // this._pendingFetchSubj.next(true);
    return this.api.get<Money[]>(this.URL).pipe(
      // finalize(() => this._pendingFetchSubj.next(false)),
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
      // tap(() => this._pendingFetchSubj.next(false)),
      tap((money: Money[]) => this._moneySubj.next(money))
      // tap((fetchAll) => console.log('%c[fetchAll]', Colors.BLACK, fetchAll)),
    );
  }

  filterMoney(data: Money[], filter: MoneyFilter): Money[] {
    return data.filter((item) => {
      const afterStartDate =
        !filter.startDate || new Date(item.createdAt) >= filter.startDate;

      const beforeEndDate =
        !filter.endDate ||
        new Date(item.createdAt) <=
          new Date(filter.endDate.setHours(23, 59, 59, 999));

      const typeMatch = !filter.type || item.type?.includes(filter.type);

      const yearMatch =
        !filter.year || new Date(item.createdAt).getFullYear() === filter.year;

      return afterStartDate && beforeEndDate && typeMatch && yearMatch;
    });
  }

  betterFilter(filter: Partial<MoneyFilter>) {
    this.updateFilter(filter);
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
      tap((x) => {
        this._moneySubj.next(newMoneys);
        console.log('[EDIT]', newMoneys);
        console.log('[EDIT #2]', x);
      }),
      catchError((err) => {
        const message = 'Could not edit money';
        // this.messages.showErrors(message);
        console.log(message, err);
        return throwError(err);
      }),
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

  private updateFilter(newFilter: MoneyFilter) {
    this._filterSubj.next(newFilter);
  }

  moneyGroups$: Observable<MoneyGroup[]> = this.filteredMoney$.pipe(
    map((data: Money[]) => this.groupMoney(data).sort(compareBy('period')))
  );

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

export function getMonth(date: Date) {
  return date.toString().substring(0, 7);
  /*let res;
  // console.log('[getMonth]', typeof date, date instanceof Date); // Debugging line
  if (!(date instanceof Date)) {
    date = new Date(date);
  } else {
    console.log('[getMonth ERROR]', typeof date, date); // Debugging line
    // return date?.getMonth() + 1 ?? 0;
  }

  let onlyDate = date.getDate();
  console.log('%c[onlyDate]', Colors.INFO, onlyDate);
  // return date.toString().substring(0, 7);
  res = date?.getMonth();
  console.log('[getMonth]', date, res);

  return res + 1;*/
}

// export function chooseCurrentYear(years: number[] | null) {
export function chooseCurrentYear(years: number[]) {
  const currentYear = new Date().getFullYear();
  if (years?.includes(currentYear)) {
    return currentYear;
  } else {
    return years?.sort()[years.length - 1];
  }
}
