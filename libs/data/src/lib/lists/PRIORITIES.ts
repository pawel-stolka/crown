import { Priority } from '@crown/data';

export const PRIORITIES: Priority[] = [
  Priority.URGENT,
  Priority.HIGH,
  Priority.MEDIUM,
  Priority.LOW,
  Priority.WHO_CARES,
];

export const SHOW_PRIORITY = (
  priority: Priority | undefined
): string | null => {
  const priorityMap = {
    [Priority.URGENT]: 'KRYTYCZNY',
    [Priority.HIGH]: 'WYSOKI',
    [Priority.MEDIUM]: 'ŚREDNI',
    [Priority.LOW]: 'NISKI',
    [Priority.WHO_CARES]: 'A PO CO?',
  };

  return priority ? priorityMap[priority] : null;
};
