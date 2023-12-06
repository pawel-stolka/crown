import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Status, Todo } from '@crown/data';
import {
  catchError,
  throwError,
  map,
  tap,
  BehaviorSubject,
  Observable,
  filter,
  shareReplay,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private dataLoaded = false;
  private _todosSubj = new BehaviorSubject<Todo[]>([]); //this.mockTodo);
  todos$: Observable<Todo[]> = this._todosSubj.asObservable();
  URL = 'http://localhost:3000/todos';

  constructor(private http: HttpClient) {}

  fetchAll$(token: string | null) {
    if (!this.dataLoaded) {
      // return this.http.get<Todo[]>(this.URL, { headers: this.headers }).pipe(
      return this.http.get<Todo[]>(this.URL).pipe(
        catchError((err) => {
          const message = '[fetchAll | TODO] Something wrong...';
          // this.messages.showErrors(message);
          console.log(message, err);
          return throwError(err);
        }),
        tap(() => (this.dataLoaded = true)),
        tap((all) => console.log('[fetchAll$]', all)),
        // map((todos) => todos?.length),
        tap((todos: Todo[]) => this._todosSubj.next(todos)),
        shareReplay(1)
        // map((money: Money[]) => money.sort(compareBy('period', false))),
      );
    }
    return this.todos$;
    // }
    // return this.todos$;
    // return this.http.get<Money[]>(this.URL, { headers: this.headers }).pipe(
    //   catchError((err) => {
    //     const message = '[fetchAll] Something wrong...';
    //     // this.messages.showErrors(message);
    //     console.log(message, err);
    //     return throwError(err);
    //   }),
    //   // map((money: Money[]) => money.sort(compareBy('period', false))),
    //   tap((money: Money[]) => this._moneySubj.next(money))
    // );
  }

  create(changes?: Partial<Todo>) {
    return this.http
      .post<Todo>(this.URL, changes) //, { headers: this.headers })
      .pipe(
        tap((todo) => {
          console.log('created | todo', todo);
          const todos: Todo[] = [...this._todosSubj.value, todo];
          this._todosSubj.next(todos);
        })
      );
  }
}
