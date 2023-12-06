import { Status } from '../enums/Status';

export interface Todo {
  id: string;
  name: string;
  description: string;
  status: Status;
}
