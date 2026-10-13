import { list, save, findById } from '../repository.js';

export function update(id, dados) {
  const book = findById(id);

  if (!book) {
    return {
      status: 404,
      message: 'Livro não encontrado',
    };
  }

  const books = list();
  const index = books.findIndex((item) => item.id === book.id);

  books[index] = {
    ...books[index],
    ...dados,
  };

  save(books);

  return {
    status: 200,
    message: 'Livro atualizado com sucesso',
  };
}
