import { BookRepository } from '../repositories/book.repository.js';
import { fromRepository } from './types.js';
import type { BookResponse } from './types.js';

type DestroyBookInput = { id: string; definitive: boolean };

export class DestroyBookUsecase {
  public async execute({ id, definitive }: DestroyBookInput): Promise<BookResponse> {
    const repository = new BookRepository();

    const result = definitive
      ? await repository.destroy(id)
      : await repository.disable(id);

    return fromRepository(result, 'Livro não encontrado ou já inativo');
  }
}