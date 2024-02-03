import { getColorFrom } from "./getColorFrom";

export function colorize(text?: string) {
  return !!text
    ? {
        border: `2px solid ${getColorFrom(text)}`,
        'background-color': `${getColorFrom(text, 0.5)}`,
        'border-radius': '15px',
        padding: '5px',
      }
    : null;
}
