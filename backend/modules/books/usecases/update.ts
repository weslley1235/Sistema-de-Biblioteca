import { Book } from '../entities/index';
import { BookRepository } from '../repositories/book.repository';
import type { BookInput } from '../validator';
import { bookFailure, fromRepository } from './types';
import type { BookResponse } from './types';

type UpdateBookInput = { id: string; data: BookInput };

export class UpdateBookUsecase {
  public async execute({ id, data }: UpdateBookInput): Promise<BookResponse> {
    const book = new Book({ id, ...data });
    const validation = book.validate();

    if (validation.isFail) {
      return bookFailure(400, validation.error?.message ?? 'Livro inválido');
    }

    const updated = await new BookRepository().update(book);

    return fromRepository(updated, 'Livro não encontrado');
  }
}
