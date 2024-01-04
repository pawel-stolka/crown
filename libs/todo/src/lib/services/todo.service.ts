import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
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
  of,
} from 'rxjs';
import { HttpService } from '@crown/http';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private http = inject(HttpService);
  private _http = inject(HttpClient);
  private authService = inject(AuthService);

  private URL = `${API_URL}/todo`;
  private dataLoaded = false;
  private _todosSubj = new BehaviorSubject<Todo[]>([]);

  todos$: Observable<Todo[]> = this._todosSubj.asObservable();
  accessRole$: Observable<string | null> = of(null); // this.authService.accessRole$;
  isAdmin$ = this.authService.isAdmin$;

  headers!: { Authorization: string };
  tokenEmail: TokenEmail | null = null;

  get todos() {
    return this._todosSubj.value;
  }

  constructor() {
    // console.log('todo service CTOR');
    this.data$().subscribe();
  }

  data$() {
    return this.authService.tokenEmail$.pipe(
      catchError((err) => {
        console.log('Could not get token', err);
        return throwError(err);
      }),
      filter((x) => !!x),
      // tap(
      //   (tokenEmail) =>
      //     (this.headers = { Authorization: `Bearer ${tokenEmail?.token}` })
      // )
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

  testHttp() {
    this.http
      .get(this.URL)
      .pipe(tap((x) => console.log('testHttp', x)))
      .subscribe();
  }

  fetchAll$(token: string | null) {
    if (!this.dataLoaded) {
      return this.http.get<Todo[]>(this.URL).pipe(
        tap(() => (this.dataLoaded = true)),
        tap((todos: Todo[]) => this._todosSubj.next(todos)),
        shareReplay(1)
      );
    }
    return this.todos$;
  }

  create(changes?: Partial<Todo>) {
    return this.http.post<Todo>(this.URL, changes).pipe(
      tap((todo) => {
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

    // copy of todos
    const newTodos: Todo[] = this.todos.slice(0);
    newTodos[index] = newTodo;
    this._todosSubj.next(newTodos);

    return this.http
      .put<Todo>(`${this.URL}/${id}`, changes)
      .pipe(
        catchError((err) => {
          const message = `Could not edit Todo: ${changes.id}`;
          // this.messages.showErrors(message);
          console.log(message, err);
          return throwError(err);
        }),
        // tap((x) => console.log('EDIT result', x)),
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
