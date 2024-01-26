import { Injectable, inject } from '@angular/core';
import {
  API_URL,
  Status,
  Todo,
  StatusChange,
  TodoEvent,
  TokenEmail,
} from '@crown/data';
import {
  catchError,
  throwError,
  tap,
  BehaviorSubject,
  Observable,
  shareReplay,
  of,
  switchMap,
} from 'rxjs';
import { ApiService, AuthService, ToastService } from '@crown/shared';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private api = inject(ApiService);
  private authService = inject(AuthService);
  private toast = inject(ToastService);

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
    if (!this.dataLoaded) {
      return this.api.get<Todo[]>(this.URL).pipe(
        tap(() => (this.dataLoaded = true)),
        tap((todos: Todo[]) => this._todosSubj.next(todos)),
        shareReplay(1)
      );
    }
    return this.todos$;
  }

  create$(changes?: Partial<Todo>) {
    return this.api.post<Todo>(this.URL, changes).pipe(
      tap((todo) => {
        const todos: Todo[] = [...this._todosSubj.value, todo];
        this._todosSubj.next(todos);
      })
    );
  }

  edit$(id: string, changes: Partial<Todo>) {
    const index = this.todos.findIndex((todo) => todo.id === id);
    const newTodo: Todo = {
      ...this.todos[index],
      ...changes,
    };

    const newTodos: Todo[] = this.todos.slice(0);
    newTodos[index] = newTodo;
    this._todosSubj.next(newTodos);

    return this.api.put<Todo>(`${this.URL}/${id}`, changes).pipe(
      catchError((err) => {
        const message = `Could not edit Todo: ${changes.id}`;
        this.toast.showError('Błąd edycji', `Nie poszło z ${changes.title}`);
        // this.messages.showErrors(message);
        console.log(message, err);
        return throwError(err);
      }),
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

    this.edit$(id, todo).subscribe();
  }
}
