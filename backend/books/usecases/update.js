import { update as updateBook } from '../repository.js';

export async function update(id, dados) {
  const updated = await updateBook(id, dados);

  if (!updated) {
    return {
      status: 404,
      message: 'Livro não encontrado',
    };
  }

  return {
    status: 200,
    message: 'Livro atualizado com sucesso',
  };
}
