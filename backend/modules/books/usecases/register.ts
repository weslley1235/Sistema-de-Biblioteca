import { v4 as uuidv4 } from 'uuid';

import { databaseStrategy, type DatabaseProvider } from '../../../shared/index.js';
import { Book } from '../entities/index.js';
import { BOOK_RECORD_NOT_FOUND } from '../repositories/book.repository.js';
import { bookFailure } from './types.js';
import type { IBookRepository } from '../repositories/index.js';
import type { BookInput } from '../validator.js';
import type { BookResponse } from './types.js';

export class RegisterBookUsecase {
  constructor(private readonly bookRepository: IBookRepository) {}

  public async execute(data: BookInput): Promise<BookResponse> {
    const existing = await this.bookRepository.findByTitle(data.title);

    if (!existing.isFail) {
      return bookFailure(409, 'Esse livro já tem cadastro');
    }

    if (existing.error?.message !== BOOK_RECORD_NOT_FOUND) {
      return bookFailure(500, existing.error?.message ?? 'Erro ao consultar livro');
    }

    const book = new Book({ id: uuidv4(), ...data });
    const validation = book.validate();

    if (validation.isFail) {
      return bookFailure(400, validation.error?.message ?? 'Livro inválido');
    }

    const saved = await this.bookRepository.save(book);

    if (saved.isFail) {
      return bookFailure(500, saved.error?.message ?? 'Erro ao cadastrar livro');
    }

    return { isFail: false };
  }
}

export class RegisterBookFactory {
  public static factory(provider: DatabaseProvider) {
    return new RegisterBookUsecase(databaseStrategy[provider]().book);
  }
}