import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Status, Todo, TodoAction, TodoEvent } from '@crown/data';
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

  get todos() {
    return this._todosSubj.value;
  }

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

    console.log('[this.todos =>]', this.todos);

    return this.http
      .put<Todo>(`${this.URL}/${id}`, changes /*, { headers: this.headers }*/)
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
    console.log('[status]', event);
    const { action, id } = event;

    // let todo: Todo | Partial<Todo> = this.todos.find(todo => todo.id === event.id)
    let status; // = action === 'upgrade' ? Status.IN_PROGRESS : Status.DONE;
    let currentTodo: Todo | undefined = this.todos.find((todo) => todo.id === id)
    // const oldStatus = currentTodo?.status;
    // console.log('[oldStatus]', oldStatus);


    switch (action) {
      case TodoAction.UPGRADE:
        status = currentTodo?.status === Status.TO_DO ? Status.IN_PROGRESS : Status.DONE;

        break;
      case TodoAction.DOWNGRADE:
        status =
        currentTodo?.status === Status.IN_PROGRESS ? Status.TO_DO : Status.IN_PROGRESS;
        break;
    }

    let todo: Partial<Todo> = {
      ...currentTodo,
      status,
      // updatedAt: ''
    };
    console.log('[updateStatus]', event, todo);

    this.edit(id, todo).subscribe();
  }
}
