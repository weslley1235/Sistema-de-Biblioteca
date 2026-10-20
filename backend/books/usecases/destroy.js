import { destroy as destroyBook } from '../repository.js';

export async function destroy(id, definitive = false) {
  const deleted = await destroyBook(id, definitive);

  if (!deleted) {
    return {
      status: 404,
      message: 'Livro não encontrado ou já inativo',
    };
  }

  return {
    status: 200,
    message: definitive
      ? 'Livro e histórico de empréstimos excluídos com sucesso'
      : 'Livro inativado com sucesso',
  };
}
