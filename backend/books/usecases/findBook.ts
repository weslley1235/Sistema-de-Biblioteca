import { findById } from '../repository.js';
import type { Book } from '../repository.js';

export async function findBook(id: string): Promise<Book | undefined> {
  return await findById(id);
}
