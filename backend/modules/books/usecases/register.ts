import { v4 as uuidv4 } from 'uuid';

import { Book } from '../entities/index';
import type {IBookRepository} from '../repositories/books.repository.interface';
import { BOOK_RECORD_NOT_FOUND } from '../repositories/book.repository';
import { bookFailure } from './types';
import type { BookInput } from '../validator';
import type { BookResponse } from './types';

export class RegisterBookUsecase {
    constructor(private readonly repository: IBookRepository) {}

  public async execute(data: BookInput): Promise<BookResponse> {

    const existing = await this.repository.findByTitle(data.title);

    if (!existing.isFail) {
      return bookFailure(409, 'Esse livro já tem cadastro');
    }

    if (existing.error?.message !== BOOK_RECORD_NOT_FOUND) {
      return bookFailure(
        500,
        existing.error?.message ?? 'Erro ao consultar livro',
      );
    }

    const book = new Book({ id: uuidv4(), ...data });
    const validation = book.validate();

    if (validation.isFail) {
      return bookFailure(400, validation.error?.message ?? 'Livro inválido');
    }

    const saved = await this.repository.save(book);

    if (saved.isFail) {
      return bookFailure(
        500,
        saved.error?.message ?? 'Erro ao cadastrar livro',
      );
    }

    return { isFail: false };
  }
}
