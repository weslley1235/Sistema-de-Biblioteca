import { BookRepository } from '../repositories/book.repository';
import { fromRepository } from './types';
import type { BookResponse } from './types';

export class ReactivateBookUsecase {
  public async execute(id: string): Promise<BookResponse> {
    const result = await new BookRepository().reactivate(id);

    return fromRepository(result, 'Livro não encontrado ou já ativo');
  }
}
