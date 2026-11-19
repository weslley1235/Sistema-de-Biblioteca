import {databaseStrategy,type DatabaseProvider,type Response} from '../../../shared/index.js';
import type { BookProps } from '../entities/index.js';
import type { IBookRepository } from '../repositories/index.js';

type FindBookResponse = BookProps;

interface IUsecase<Input, Output> {
  execute(input: Input): Promise<Response<Output>>;
}

export class FindBookUsecase implements IUsecase<string, FindBookResponse> {
  constructor(private readonly bookRepository: IBookRepository) {}

  public async execute(input: string): Promise<Response<BookProps>> {
    const find = await this.bookRepository.findById(input);

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

export class FindBookFactory {
  public static factory(provider: DatabaseProvider) {
    return new FindBookUsecase(databaseStrategy[provider]().book);
  }
}