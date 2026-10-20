import { list, listInactive } from '../repository.js';

export async function listBooks() {
  return await list();
}

export async function listInactiveBooks() {
  return await listInactive();
}
