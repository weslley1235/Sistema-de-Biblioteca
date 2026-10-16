import { list, save, findById } from '../repository.js';

export function update(id, dados) {
  const book = findById(id);

  if (!book) {
    return {
      status: 404,
      message: 'Livro não encontrado',
    };
  }

  updateBook(id, dados);

  return {
    status: 200,
    message: 'Livro atualizado com sucesso',
  };
}
