import 'dotenv/config';

import type { IBookRepository } from '../modules/books/repositories/books.repository.interface.js';
import { PostBookRepository as PostgresqlBookRepository } from '../modules/books/repositories/book.repository.js';

import type { ILoanRepository } from '../modules/emprestimo/repositories/loan.repository.interface.js';
import { LoanRepository as PostgresqlLoanRepository } from '../modules/emprestimo/repositories/loan.repository.js';
import { MysqlLoanRepository } from '../modules/emprestimo/repositories/mysql.loan.repository.js';

import type { IUserRepository } from '../modules/user/repositories/user.repository.interface.js';
import { UserRepository as PostgresqlUserRepository } from '../modules/user/repositories/user.repository.js';
import { MysqlUserRepository } from '../modules/user/repositories/mysql.user.repository.js';
import { DateFns, Moment } from './adapters/index.js';

export type DatabaseProvider = 'postgresql' | 'mysql';

export type Repositories = {
  user: IUserRepository;
  loan: ILoanRepository;
  book: IBookRepository;
};

export const databaseStrategy: Record<DatabaseProvider, () => Repositories> = {
  postgresql: () => ({
    user: new PostgresqlUserRepository(),
    loan: new PostgresqlLoanRepository(),
    book: new PostgresqlBookRepository(),
  }),

  mysql: () => ({
    user: new MysqlUserRepository(),
    loan: new MysqlLoanRepository(new DateFns()),
    book: new PostgresqlBookRepository(),
  }),
};

export const createRepositories = (
  provider: DatabaseProvider,
): Repositories => {
  return databaseStrategy[provider]();
};

export const getDatabaseProvider = (): DatabaseProvider => {
  const provider = process.env.DATABASE_PROVIDER ?? 'mysql';

  if (provider !== 'postgresql' && provider !== 'mysql') {
    throw new Error(`DATABASE_PROVIDER inválido: ${provider}`);
  }

  return provider;
};
