import { Injectable } from '@angular/core';
import { ApiService, ToastService } from '@crown/shared';
import {
  API_URL,
  Colors,
  EMPTY_STRING,
  Money,
  MoneyFilter,
  MoneyGroup,
  ToastMessage,
  chooseCurrentYear,
  compareBy,
  fixNumber,
  getMonth,
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
export class MoneyService {
  // TODO: fix tests to inject these:
  // private api = inject(ApiService);
  // private toast = inject(ToastService);
  private URL = `${API_URL}/api/money`;

  private _moneySubj = new BehaviorSubject<Money[]>([]);
  private _filterSubj: BehaviorSubject<MoneyFilter> =
    new BehaviorSubject<MoneyFilter>({});
  private _messageSubj = new BehaviorSubject(EMPTY_STRING);
  private _currentYearSubj = new BehaviorSubject<number | null>(null);

  money$ = this._moneySubj.asObservable();
  filters$ = this._filterSubj.asObservable();
  currentYear$ = this._currentYearSubj.asObservable();
  message$ = this._messageSubj.asObservable();

  allYears$ = this.money$.pipe(
    map((money) => [
      ...new Set(money.map((m) => new Date(m.createdAt).getFullYear()).sort()),
    ]),
    tap((allYears) => {
      const currentYear = chooseCurrentYear(allYears);
      this.updateFilters({ year: currentYear });
      this._currentYearSubj.next(currentYear);
    })
  );

  filteredMoney$: Observable<Money[]> = combineLatest([
    this.money$,
    this.filters$,
  ]).pipe(map(([data, filters]) => this.filterMoney(data, filters)));

  moneyGroups$: Observable<MoneyGroup[]> = this.filteredMoney$.pipe(
    map((data: Money[]) => this.groupMoney(data).sort(compareBy('period')))
  );

  get money() {
    return this._moneySubj.value;
  }

  get filters() {
    return this._filterSubj.value;
  }

  get currentYear() {
    return this._currentYearSubj.value;
  }

  get message() {
    return this._messageSubj.value;
  }

  constructor(private api: ApiService, private toast: ToastService) {
    this.initializeDataFetch$().subscribe();
  }

  get yearFilterOn() {
    return !!this.filters.year;
  }

  initializeDataFetch$() {
    return this.api.tokenEmail$.pipe(
      switchMap((tokenEmail) => {
        if (tokenEmail) {
          return this.fetchAll$();
        } else {
          return of([]);
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
        this.toast.showError(ToastMessage.DATA_FAILURE, ToastMessage.STH_WRONG);
        // this.messages.showErrors(message);
        // console.log(`%c${message}`, Colors.RED, err);
        return throwError(err);
      }),
      // TODO: isDeleted toggle for admin?
      // map((money: Money[]) => money.filter((x) => !x.isDeleted)),
      map((money: Money[]) => money.sort(compareBy('period', false))),
      map((money) =>
        money.map((m) => ({
          ...m,
          type: m.type?.toLowerCase(),
        }))
      ),
      // tap(() => this._pendingFetchSubj.next(false)),
      tap((money: Money[]) => this.updateMoney(money))
    );
  }

  updateMoney(money: Money[]) {
    this._moneySubj.next(money);
  }

  updateMessage(message: string) {
    this._messageSubj.next(message);
  }

  updateFilters(filter: MoneyFilter) {
    this._filterSubj.next(filter);
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

  create$(changes: Partial<Money>) {
    changes = setNoonAsDate(changes);

    return this.api.post<Money>(this.URL, changes).pipe(
      catchError((err) => {
        const message = 'Could not create money';
        this.toast.showError(ToastMessage.DATA_FAILURE, ToastMessage.STH_WRONG);
        // this.messages.showErrors(message);
        console.log(message, err);
        return throwError(err);
      }),
      tap((money) => {
        const update: Money[] = [...this.money, money];
        this.updateMoney(update);
        this.toast.showSuccess('Dodałeś', `${money.type}`);
      })
    );
  }

  edit$(id: string, changes: Partial<Money>) {
    changes = setNoonAsDate(changes);

    const index = this.money.findIndex((money) => money.id === id);
    const newMoney: Money = {
      ...this.money[index],
      ...changes,
    };

    const newMoneys: Money[] = this.money.slice(0);
    newMoneys[index] = newMoney;

    return this.api.put<Money>(`${this.URL}/${id}`, changes).pipe(
      catchError((err) => {
        const message = 'Could not edit money';
        this.toast.showError(ToastMessage.DATA_FAILURE, ToastMessage.STH_WRONG);
        // this.messages.showErrors(message);
        console.log(message, err);
        return throwError(err);
      }),
      tap(() => {
        this.updateMoney(newMoneys);
        this.toast.showSuccess(
          ToastMessage.SUCCESS,
          `ZMIANA: ${newMoney.type}`
        );
      }),
      shareReplay()
    );
  }

  delete$(id: string) {
    return this.api.delete<Money>(`${this.URL}/${id}`).pipe(
      catchError((err) => {
        const message = '[delete] Something wrong...';
        // this.messages.showErrors(message);
        this.toast.showError(ToastMessage.DATA_FAILURE, ToastMessage.STH_WRONG);
        console.log(message, err);
        return throwError(err);
      }),
      tap((money: Money) => {
        const newMoneyList = this.money.filter((x) => x.id !== money.id);
        this.toast.showSuccess('Usunięcie', `${money.type} ${money.price}`);
        // this._moneySubj.next(newMoneyList);
        this.updateMoney(newMoneyList);
      })
    );
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

  filterMoney(data: Money[], filter: MoneyFilter): Money[] {
    return data.filter((item) => {
      const itemDate = new Date(item.createdAt);
      let afterStartDate = true;
      let beforeEndDate = true;

      const startDateWithTime = filter.startDate
        ? new Date(filter.startDate)
        : new Date();
      startDateWithTime.setHours(12, 0, 0, 0);

      afterStartDate = !filter.startDate || itemDate >= startDateWithTime;

      const endDateWithTime = filter.endDate
        ? new Date(filter.endDate)
        : new Date();
      endDateWithTime.setHours(23, 59, 59, 999);
      beforeEndDate = itemDate <= endDateWithTime;

      const yearMatch = !filter.year || itemDate.getFullYear() === filter.year;

      return afterStartDate && beforeEndDate && yearMatch;
    });
  }

  __filterMoney(data: Money[], filter: MoneyFilter): Money[] {
    console.log('%c[this.filterMoney]', Colors.RED, filter);

    return data.filter((item) => {
      const itemDate = new Date(item.createdAt);

      const afterStartDate =
        !filter.startDate || itemDate >= new Date(filter.startDate);

      let beforeEndDate = true;
      if (filter.endDate) {
        console.log('%c[filter.endDate]', Colors.MAG, filter.endDate);

        if (filter.endDate instanceof Date) {
          const endDateWithTime = new Date(filter.endDate);
          endDateWithTime.setHours(23, 59, 59, 999);
          beforeEndDate = itemDate <= endDateWithTime;
        } else {
          console.log('filter.endDate is not a Date object', filter.endDate);
          try {
            const endDateWithTime = new Date(filter.endDate);
            endDateWithTime.setHours(23, 59, 59, 999);
            beforeEndDate = itemDate <= endDateWithTime;
            console.log(
              '%c[endDateWithTime]',
              Colors.BLACK,
              endDateWithTime,
              beforeEndDate
            );
          } catch (error) {
            console.log(error);
          }
          beforeEndDate = false;
        }
      }

      const typeMatch = !filter.type || item.type?.includes(filter.type);

      const yearMatch = !filter.year || itemDate.getFullYear() === filter.year;

      return afterStartDate && beforeEndDate && typeMatch && yearMatch;
    });
  }

  _filterMoney(data: Money[], filter: MoneyFilter): Money[] {
    console.log('%c[this.filterMoney]', Colors.RED, filter);
    return data.filter((item) => {
      // console.log('[filterMoney]', item);

      const afterStartDate =
        !filter.startDate || new Date(item.createdAt) >= filter.startDate;

      console.log('B4 endDate', !!filter.endDate);

      const beforeEndDate =
        !filter.endDate ||
        new Date(item.createdAt) <=
          new Date(filter?.endDate?.setHours(23, 59, 59, 999));

      const typeMatch = !filter.type || item.type?.includes(filter.type);

      const yearMatch =
        !filter.year || new Date(item.createdAt).getFullYear() === filter.year;

      return afterStartDate && beforeEndDate && typeMatch && yearMatch;
    });
  }

  groupMoney(data: Money[], by = 'byMonth'): MoneyGroup[] {
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
