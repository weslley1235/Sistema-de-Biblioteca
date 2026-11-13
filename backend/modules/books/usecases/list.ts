import type { Response } from '../../../shared/index.js';
import type { Book } from '../repository.js'
import { BookRepository } from '../repositories/book.repository.js';

export class ListBooksUsecases { 
  public async execute(): Promise<Response<Array<Book>>> {
    return await new BookRepository().list();
  }
}

export class ListInactiveBookUsecase {
  public async execute(): Promise<Response<Array<Book>>> {
    return await new BookRepository().listInactive();
  }
}
