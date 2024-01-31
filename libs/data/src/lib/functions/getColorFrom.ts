import hash from 'string-hash';
import { TinyColor } from '@ctrl/tinycolor';

export function getColorFrom(text: string, alpha = 1) {
  return new TinyColor({ h: hash(text) % 360, s: 100, l: 50, a: alpha });
}
