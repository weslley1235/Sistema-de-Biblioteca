import { BookRepository } from '../repositories/book.repository.js';
import { fromRepository } from './types.js';
import type { BookResponse } from './types.js';

export class ReactivateBookUsecase {
  public async execute(id: string): Promise<BookResponse> {
    const result = await new BookRepository().reactivate(id);

    return fromRepository(result, 'Livro não encontrado ou já ativo');
  }
}
