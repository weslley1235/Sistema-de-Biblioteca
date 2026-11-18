import {databaseStrategy,type DatabaseProvider,type Response} from '../../../shared/index.js';
import type { Book } from '../entities/index.js';
import type { IBookRepository } from '../repositories/index.js';

export class ListBooksUsecases {
  constructor(private readonly bookRepository: IBookRepository) {}

  public async execute(): Promise<Response<Array<Book>>> {
    return await this.bookRepository.list();
  }
}

export class ListInactiveBookUsecase {
  constructor(private readonly bookRepository: IBookRepository) {}

  public async execute(): Promise<Response<Array<Book>>> {
    return await this.bookRepository.listInactive();
  }
}

export class ListBooksFactory {
  public static factory(provider: DatabaseProvider) {
    return new ListBooksUsecases(databaseStrategy[provider]().book);
  }
}

export class ListInactiveBooksFactory {
  public static factory(provider: DatabaseProvider) {
    return new ListInactiveBookUsecase(databaseStrategy[provider]().book);
  }
}