import { Response } from '../../../shared/index.js';
import { BookProps } from '../entities/book.entity.js';
import { findById } from '../repository.js';

type FindBookResponse = BookProps;

export async function findBook(
  id: string,
): Promise<Response<FindBookResponse>> {
  const find = await findById(id);

  if (find.isFail) {
    return {
      isFail: true,
      error: {
        message: find.error?.message ?? '',
      },
    };
  }

  return {
    isFail: false,
    success: find.success,
  };
}
