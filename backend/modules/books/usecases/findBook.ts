
import type { IBookRepository } from '../repositories/books.repository.interface';

export class FindBookUsecase {
  constructor(private readonly repository: IBookRepository) {}

  public async execute(id: string) {
    return await this.repository.findById(id);
  }
}
