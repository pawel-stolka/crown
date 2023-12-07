import { Status } from '../enums/Status';

export interface Todo {
  id: string;
  userId?: String;
  title: string;
  description: string;
  status: Status;
  changedBy?: String;
  priority?: number;
  createdAt: string;
  updatedAt: string;
}
