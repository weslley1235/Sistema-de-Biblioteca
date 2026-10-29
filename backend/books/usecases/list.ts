import { list, listInactive } from '../repository.js';
import type { Book } from '../repository.js'

export async function listBooks(): Promise<Book[]> {
  return await list();
}

export async function listInactiveBooks(): Promise<Book[]> {
  return await listInactive();
}
