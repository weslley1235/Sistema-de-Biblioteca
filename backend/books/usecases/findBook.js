import { findById } from '../repository.js';

export function findBook(id) {
  return findById(id);
}
