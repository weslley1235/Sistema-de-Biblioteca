import { findById } from '../repository.js';

export async function findBook(id) {
  return await findById(id);
}
