import { destroy as destroyBook } from '../repository.js';

export function destroy(id) {
  destroyBook(id);

  return {
    status: 200,
    message: 'Livro excluido com sucesso',
  };
}
