import { update as updateBook } from '../repository.js';
import type { BookInput } from '../validator.js'
import type { UseCaseResult } from './types.js';

export async function update(id: string, dados: BookInput): Promise<UseCaseResult> {
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
