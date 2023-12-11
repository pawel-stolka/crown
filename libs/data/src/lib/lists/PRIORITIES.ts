import { Priority } from '@crown/data';

export const PRIORITIES: Priority[] = [
  Priority.VERY_HIGH,
  Priority.HIGH,
  Priority.MEDIUM,
  Priority.LOW,
  Priority.VERY_LOW,
  // Priority.UNDEFINED
];

export const SHOW_PRIORITY = (priority: Priority | undefined): string | null => {
  const priorityMap = {
    [Priority.VERY_HIGH]: 'VERY HIGH',
    [Priority.HIGH]: 'HIGH',
    [Priority.MEDIUM]: 'MEDIUM',
    [Priority.LOW]: 'LOW',
    [Priority.VERY_LOW]: 'VERY LOW',
    // [Priority.UNDEFINED]: null
  };

  return priority ? priorityMap[priority] : null;
};
