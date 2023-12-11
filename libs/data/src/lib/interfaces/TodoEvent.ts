import { StatusChange } from '../enums/TodoAction';

export interface TodoEvent {
  action: StatusChange;
  id: string;
}
