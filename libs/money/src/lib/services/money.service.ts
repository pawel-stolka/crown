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
  private URL = `${API_URL}/api/money`;

  private _moneySubj = new BehaviorSubject<Money[]>([]);
  private _filterSubj: BehaviorSubject<MoneyFilter> =
    new BehaviorSubject<MoneyFilter>({});
  private _messageSubj = new BehaviorSubject(EMPTY_STRING);
  private _currentYearSubj = new BehaviorSubject<number | null>(null);
  private _activeUsersSubj = new BehaviorSubject<string[]>([]);

  money$ = this._moneySubj.asObservable();
  filters$ = this._filterSubj.asObservable();
  currentYear$ = this._currentYearSubj.asObservable();
  message$ = this._messageSubj.asObservable();

  allUsers$ = this.money$.pipe(
    map((money) => [...new Set(money.map((m) => m.userId))])
  );

  activeUsers$: Observable<string[]> = this._activeUsersSubj.asObservable();

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
    this.activeUsers$,
    this.filters$,
  ]).pipe(
    map(([data, users, filters]) => {
      let usersData = users?.length
        ? data.filter((d) => users?.includes(d.userId))
        : data;
      return this.filterMoney(usersData, filters);
    })
  );

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

  get yearFilterOn() {
    return !!this.filters.year;
  }

  constructor(private api: ApiService, private toast: ToastService) {
    this.initializeDataFetch$().subscribe();
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
      map((money: Money[]) => money.filter((x) => !x.isDeleted)),
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

  setActiveUsers(users: string[]) {
    this._activeUsersSubj.next(users);
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
