import { databaseStrategy, type DatabaseProvider } from '../../../shared/index.js';
import { fromRepository } from './types.js';
import type { BookResponse } from './types.js';
import type { IBookRepository } from '../repositories/index.js';

export class ReactivateBookUsecase {
  constructor(private readonly bookRepository: IBookRepository) {}

  public async execute(id: string): Promise<BookResponse> {
    const result = await this.bookRepository.reactivate(id);

    return fromRepository(result, 'Livro não encontrado ou já ativo');
  }
}

export class ReactivateBookFactory {
  public static factory(provider: DatabaseProvider) {
    return new ReactivateBookUsecase(databaseStrategy[provider]().book);
  }
}