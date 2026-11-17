import { Response } from '../../../shared/index';
import { BookProps } from '../entities/book.entity';
import { BookRepository } from '../repositories/book.repository';

type FindBookResponse = BookProps;

interface IUsecase<Input, Output> {
  execute(input: Input): Promise<Response<Output>>;
}

export class FindBookUsecase implements IUsecase<string, FindBookResponse> {
  public async execute(input: string): Promise<Response<BookProps>> {
    const find = await new BookRepository().findById(input);

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
}
