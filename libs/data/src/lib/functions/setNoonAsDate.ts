import { Money } from '../interfaces/Money';

export function setNoonAsDate(changes?: Partial<Money>): Partial<Money> {
  const createdAt = changes?.createdAt
    ? new Date(changes?.createdAt)
    : new Date();
  createdAt.setHours(12, 0, 0, 0);

  return {
    ...changes,
    createdAt,
  };
}
