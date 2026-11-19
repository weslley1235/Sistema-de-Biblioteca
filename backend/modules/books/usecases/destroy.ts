import { databaseStrategy, type DatabaseProvider } from '../../../shared/index.js';
import { fromRepository } from './types.js';
import type { BookResponse } from './types.js';
import type { IBookRepository } from '../repositories/index.js';

type DestroyBookInput = { id: string; definitive: boolean };

export class DestroyBookUsecase {
  constructor(private readonly bookRepository: IBookRepository) {}

  public async execute({ id, definitive }: DestroyBookInput): Promise<BookResponse> {
    const result = definitive
      ? await this.bookRepository.destroy(id)
      : await this.bookRepository.disable(id);

    return fromRepository(result, 'Livro não encontrado ou já inativo');
  }
}

export class DestroyBookFactory {
  public static factory(provider: DatabaseProvider) {
    return new DestroyBookUsecase(databaseStrategy[provider]().book);
  }
}