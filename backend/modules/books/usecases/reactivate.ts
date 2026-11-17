import type { IBookRepository } from '../repositories/books.repository.interface';

import { fromRepository } from './types';
import type { BookResponse } from './types';

export class ReactivateBookUsecase {
  constructor(private readonly repository: IBookRepository) {}

  public async execute(id: string): Promise<BookResponse> {
    const result = await this.repository.reactivate(id);

    return fromRepository(result, 'Livro não encontrado ou já ativo');
  }
}