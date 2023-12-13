import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  API_URL,
  Colors,
  Status,
  Todo,
  StatusChange,
  TodoEvent,
  TokenEmail,
} from '@crown/data';
import { AuthService } from '@crown/auth/service';
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
  private URL = `${API_URL}/todo`;
  private dataLoaded = false;
  private _todosSubj = new BehaviorSubject<Todo[]>([]);

  todos$: Observable<Todo[]> = this._todosSubj.asObservable();
  accessRole$: Observable<string | undefined> = this.authService.accessRole$;

  headers!: { Authorization: string };
  tokenEmail: TokenEmail | null = null;

  get todos() {
    return this._todosSubj.value;
  }

  constructor(private http: HttpClient, private authService: AuthService) {
    console.log('todo service CTOR');
    this.data$().subscribe();
  }

  data$() {
    return this.authService.tokenEmail$.pipe(
      catchError((err) => {
        console.log('Could not get token', err);
        return throwError(err);
      }),
      filter((x) => !!x),
      tap(
        (tokenEmail) =>
          (this.headers = { Authorization: `Bearer ${tokenEmail?.token}` })
      )
      // TODO: finish after first call

      // switchMap((tokenEmail) => {
      //   if (tokenEmail?.token) {
      //     return this.fetchAll$(tokenEmail.token);
      //   } else {
      //     return of(null);
      //   }
      // })
    );
  }

  fetchAll$(token: string | null) {
    if (!this.dataLoaded) {
      return this.http.get<Todo[]>(this.URL, { headers: this.headers }).pipe(
        catchError((err) => {
          const message = '[fetchAll | TODO] Something wrong...';
          // this.messages.showErrors(message);
          console.log(message, err);
          return throwError(err);
        }),
        tap(() => (this.dataLoaded = true)),
        tap((all) => console.log('[fetchAll$]', all)),
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
    return this.http.post<Todo>(this.URL, changes).pipe(
      tap((todo) => {
        console.log('created | todo', todo);
        const todos: Todo[] = [...this._todosSubj.value, todo];
        this._todosSubj.next(todos);
      })
    );
  }

  edit(id: string, changes: Partial<Todo>) {
    const index = this.todos.findIndex((todo) => todo.id === id);
    const newTodo: Todo = {
      ...this.todos[index],
      ...changes,
    };
    console.log('[EDIT]', newTodo, changes);


    // copy of todos
    const newTodos: Todo[] = this.todos.slice(0);
    newTodos[index] = newTodo;
    this._todosSubj.next(newTodos);

    return this.http
      .put<Todo>(`${this.URL}/${id}`, changes, { headers: this.headers })
      .pipe(
        catchError((err) => {
          const message = `Could not edit Todo: ${changes.id}`;
          // this.messages.showErrors(message);
          console.log(message, err);
          return throwError(err);
        }),
        tap((x) => console.log('EDIT result', x)),
        shareReplay()
      );
  }

  updateStatus(event: TodoEvent): void {
    const { action, id } = event;

    let status;
    let currentTodo: Todo | undefined = this.todos.find(
      (todo) => todo.id === id
    );

    // TODO: refactor - maybe in state management?
    switch (action) {
      case StatusChange.UPGRADE:
        status =
          currentTodo?.status === Status.TO_DO
            ? Status.IN_PROGRESS
            : currentTodo?.status === Status.IN_PROGRESS
            ? Status.DONE
            : Status.CLOSED;

        break;
      case StatusChange.DOWNGRADE:
        status =
          currentTodo?.status === Status.IN_PROGRESS
            ? Status.TO_DO
            : Status.IN_PROGRESS;
        break;
    }

    let todo: Partial<Todo> = {
      ...currentTodo,
      status,
    };
    console.log('[updateStatus]', event, todo);

    this.edit(id, todo).subscribe();
  }
}
