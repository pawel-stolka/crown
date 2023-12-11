import { Priority } from '@crown/data';

export const PRIORITIES: Priority[] = [
  Priority.VERY_HIGH,
  Priority.HIGH,
  Priority.MEDIUM,
  Priority.LOW,
  Priority.VERY_LOW,
];

export const SHOW_PRIORITY = (priority: Priority): string => {
  const priorityMap = {
    [Priority.VERY_HIGH]: 'VERY HIGH',
    [Priority.HIGH]: 'HIGH',
    [Priority.MEDIUM]: 'MEDIUM',
    [Priority.LOW]: 'LOW',
    [Priority.VERY_LOW]: 'VERY LOW',
  };

  return priorityMap[priority];
};
