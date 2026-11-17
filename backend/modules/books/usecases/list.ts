import type { Response } from '../../../shared/index';
import type { Book } from '../repository';
import { BookRepository } from '../repositories/book.repository';

class ListBooksUsecases {
  public async execute(): Promise<Response<Array<Book>>> {
    return await new BookRepository().list();
  }
}

class ListInactiveBookUsecase {
  public async execute(): Promise<Response<Array<Book>>> {
    return await new BookRepository().listInactive();
  }
}

export class ListBooksFactory {
  public static factory(inactive: boolean) {
    if (inactive) return new ListInactiveBookUsecase();

    return new ListBooksUsecases();
  }
}
