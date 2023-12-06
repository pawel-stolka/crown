import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Status, Todo } from "@crown/data";
import { catchError, throwError, map, tap, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private mockTodo: Todo[] = [
    {
      id: '1',
      name: 'test',
      description: 'as above',
      status: Status.TO_DO
    },
    {
      id: '2',
      name: 'test-2',
      description: 'as above',
      status: Status.TO_DO
    }
  ]

  private _todosSubj = new BehaviorSubject<Todo[]>(this.mockTodo);
  todos$ = this._todosSubj.asObservable();

  constructor(private http: HttpClient) {
    console.log('todo Service CTOR');

    this.fetchAll$(null).subscribe();
  }

  fetchAll$(token: string | null) {
    return this.todos$.pipe(
         catchError((err) => {
        const message = '[fetchAll | TODO] Something wrong...';
        // this.messages.showErrors(message);
        console.log(message, err);
        return throwError(err);
      }),
      // map((money: Money[]) => money.sort(compareBy('period', false))),
      tap((todos: Todo[]) => this._todosSubj.next(todos))
    );
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
}
