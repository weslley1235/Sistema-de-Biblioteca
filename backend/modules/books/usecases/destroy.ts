import type { IBookRepository } from '../repositories/books.repository.interface';

import { fromRepository } from './types';
import type { BookResponse } from './types';

type DestroyBookInput = {
  id: string;
  definitive: boolean;
};

export class DestroyBookUsecase {
  constructor(private readonly repository: IBookRepository) {}

  public async execute({
    id,
    definitive,
  }: DestroyBookInput): Promise<BookResponse> {
    let result;

    if (definitive) {
      result = await this.repository.destroy(id);
    } else {
      result = await this.repository.disable(id);
    }

    return fromRepository(
      result,
      'Livro não encontrado ou já inativo',
    );
  }
}