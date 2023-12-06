import { TodoAction } from '../enums/TodoAction';

export interface TodoEvent {
  action: TodoAction;
  id: string;
}
