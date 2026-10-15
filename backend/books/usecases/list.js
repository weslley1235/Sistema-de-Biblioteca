import { list } from '../repository.js';

export function listBooks() {
  try {
    return list();
  } catch (error) {
    throw new Error(`Erro ao listar livros: ${error.message}`);
  }
}
