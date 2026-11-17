export type UseCaseResult = {
  status: number;
  message: string;
};

import type { Response } from '../../../shared/index';
import { BOOK_NOT_FOUND } from '../repositories/book.repository';

export type BookFailure = { status: number };
export type BookResponse = Response<void, BookFailure>;

export function bookFailure(status: number, message: string): BookResponse {
  return { isFail: true, error: { message, metadata: { status } } };
}

export function fromRepository(
  result: Response<void>,
  notFoundMessage: string,
): BookResponse {
  if (!result.isFail) return { isFail: false };

  if (result.error?.message === BOOK_NOT_FOUND) {
    return bookFailure(404, notFoundMessage);
  }

  return bookFailure(500, result.error?.message ?? 'Erro inesperado');
}
