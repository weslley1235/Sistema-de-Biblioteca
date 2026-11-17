import type { Response } from '../../../shared/index';
import type { Book } from '../repository';
import type { IBookRepository } from '../repositories/books.repository.interface';

export class ListBooksUsecases {
    constructor(private readonly repository: IBookRepository) {}

  public async execute(): Promise<Response<Array<Book>>> {
    return await this.repository.list();
  }
}

export class ListInactiveBookUsecase {
    constructor(private readonly repository: IBookRepository) {}

  public async execute(): Promise<Response<Array<Book>>> {
    return await this.repository.listInactive();
  }
}

export class ListBooksFactory {
  public static factory(inactive: boolean,repository: IBookRepository) {
    if (inactive) {
      return new ListInactiveBookUsecase(repository);
    }

    return new ListBooksUsecases(repository);
  }
}