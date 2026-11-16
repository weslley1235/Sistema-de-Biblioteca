import { randomInt } from 'node:crypto';

const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export function generateMatricula(size = 10): string {
  let result = '';

  for (let i = 0; i < size; i++) {
    result += CHARS[randomInt(CHARS.length)];
  }

  return result;
}
