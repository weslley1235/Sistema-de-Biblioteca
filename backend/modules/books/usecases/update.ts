import { databaseStrategy, type DatabaseProvider } from '../../../shared/index.js';
import { Book } from '../entities/index.js';
import { bookFailure, fromRepository } from './types.js';
import type { IBookRepository } from '../repositories/index.js';
import type { BookInput } from '../validator.js';
import type { BookResponse } from './types.js';

type UpdateBookInput = { id: string; data: BookInput };

export class UpdateBookUsecase {
  constructor(private readonly bookRepository: IBookRepository) {}

  public async execute({ id, data }: UpdateBookInput): Promise<BookResponse> {
    const book = new Book({ id, ...data });
    const validation = book.validate();

    if (validation.isFail) {
      return bookFailure(400, validation.error?.message ?? 'Livro inválido');
    }

    const updated = await this.bookRepository.update(book);

    return fromRepository(updated, 'Livro não encontrado');
  }
}

export class UpdateBookFactory {
  public static factory(provider: DatabaseProvider) {
    return new UpdateBookUsecase(databaseStrategy[provider]().book);
  }
}