import { Book } from '../entities';
import type { IBookRepository } from '../repositories/books.repository.interface';

import { bookFailure, fromRepository } from './types';
import type { BookInput } from '../validator';
import type { BookResponse } from './types';

type UpdateBookInput = {
  id: string;
  data: BookInput;
};

export class UpdateBookUsecase {
  constructor(private readonly repository: IBookRepository) {}

  public async execute({
    id,
    data,
  }: UpdateBookInput): Promise<BookResponse> {
    const book = new Book({ id, ...data });

    const validation = book.validate();

    if (validation.isFail) {
      return bookFailure(
        400,
        validation.error?.message ?? 'Livro inválido',
      );
    }

    const updated = await this.repository.update(book);

    return fromRepository(updated, 'Livro não encontrado');
  }
}