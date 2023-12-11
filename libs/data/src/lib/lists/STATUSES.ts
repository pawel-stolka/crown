import { Status } from '@crown/data';

export const STATUSES: Status[] = [
  Status.TO_DO,
  Status.IN_PROGRESS,
  Status.DONE,
  Status.CLOSED,
];

export const SHOW_STATUS = (status: Status): string => {
  const statusMap = {
    [Status.TO_DO]: 'TO DO',
    [Status.IN_PROGRESS]: 'IN PROGRESS',
    [Status.DONE]: 'DONE',
    [Status.CLOSED]: 'CLOSED',
  };

  return statusMap[status];
};
