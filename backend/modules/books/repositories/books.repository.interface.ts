import { Response } from '../../../shared';
import { Book } from '../entities';

interface IRepository<Entity> {
  save(prop: Entity): Promise<Response<void>>;
  list(): Promise<Response<Array<Book>>>;
  saveMany(books: Array<Book>): Promise<Response<void>>;
  findById(id: string): Promise<Response<Book>>;
}

export interface IBookRepository extends IRepository<Book> {
  listInactive(): Promise<Response<Array<Book>>>;
  findByTitle(title: string): Promise<Response<Book>>;
  update(book: Book): Promise<Response<void>>;
  destroy(id: string): Promise<Response<void>>;
  disable(id: string): Promise<Response<void>>;
  reactivate(id: string): Promise<Response<void>>;
}
