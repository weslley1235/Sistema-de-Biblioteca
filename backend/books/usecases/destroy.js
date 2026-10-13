import { findById, destroy as destroyBook } from '../repository.js';

export function destroy(id) {
  const book = findById(id);

  if (!book) {
    return {
      status: 404,
      message: 'Livro não encontrado',
    };
  }

  destroyBook(id);

  return {
    status: 200,
    message: 'Livro excluído com sucesso',
  };
}
