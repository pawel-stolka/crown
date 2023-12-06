import { Status } from '../enums/Status';

export interface Todo {
  id: string;
  title: string;
  description: string;
  status: Status;
  createdAt: string;
  updatedAt: string;
}
