import type { QueryResult, QueryResultRow } from 'pg';

import database from '../../../../database/db.js';
import type { BookProps } from '../entities/index.js';

import { Response } from '../../../shared';
import { Book } from '../entities';
import { IBookRepository } from './books.repository.interface';

export class BookRepository implements IBookRepository {
  private readonly BOOK_COLUMNS = 'id, title, autor, ano';

  private async query<T extends QueryResultRow = QueryResultRow>(
    errorMessage: string,
    sql: string,
    params: unknown[] = [],
  ): Promise<QueryResult<T>> {
    try {
      return await database.query<T>(sql, params);
    } catch (error) {
      throw new Error(errorMessage, { cause: error });
    }
  }

  public async list(): Promise<Response<Array<Book>>> {
    const result = await this.query<BookProps>(
      'Erro ao listar livros',
      `SELECT ${this.BOOK_COLUMNS} FROM livros WHERE ativo = TRUE ORDER BY title`,
    );

    if (result.rowCount === 0) {
      return {
        isFail: true,
        error: {
          message: 'Registros não encontrados',
        },
      };
    }

    const books = result.rows
      .map((book) => new Book(book))
      .filter((book) => book.validate().isFail);

    return {
      isFail: false,
      success: {
        value: books,
      },
    };
  }

  public async listInactive(): Promise<Response<Array<Book>>> {
    const result = await this.query<BookProps>(
      'Erro ao listar livros inativos',
      `SELECT ${this.BOOK_COLUMNS} FROM livros WHERE ativo = FALSE ORDER BY title`,
    );

    if (result.rowCount === 0) {
      return {
        isFail: true,
        error: {
          message: 'Registros não encontrados',
        },
      };
    }

    const books = result.rows
      .map((book) => new Book(book))
      .filter((book) => book.validate().isFail);

    return {
      isFail: false,
      success: {
        value: books,
      },
    };
  }

  public async save(book: Book): Promise<Response<void>> {
    try {
      const { ano, autor, id, title } = book;

      await this.query(
        'Erro ao salvar livro',
        'INSERT INTO livros (id, title, autor, ano) VALUES ($1, $2, $3, $4)',
        [id, title, autor, ano],
      );

      return {
        isFail: false,
      };
    } catch (error: any) {
      return {
        isFail: true,
        error: {
          message: error.message ?? 'Houve um erro ao salvar o livro',
        },
      };
    }
  }

  public async saveMany(books: Array<Book>): Promise<Response<void>> {
    try {
      await this.query(
        'Erro ao salvar livro',
        'INSERT INTO livros (id, title, autor, ano) VALUES ($1, $2, $3, $4)',
        books.map((book) => [book.id, book.title, book.autor, book.ano]),
      );

      return {
        isFail: false,
      };
    } catch (error: any) {
      return {
        isFail: true,
        error: {
          message: error.message ?? 'Houve um erro ao salvar os livros',
        },
      };
    }
  }

  public async findById(id: string): Promise<Response<Book>> {
    try {
      const result = await this.query<BookProps>(
        'Erro ao buscar livro por id',
        `SELECT ${this.BOOK_COLUMNS} FROM livros WHERE id = $1`,
        [id],
      );

      const book = result.rows[0];

      if (!book) {
        return {
          isFail: true,
          error: { message: 'Registro não encontrado' },
        };
      }

      const bookEntity = new Book(book);
      const validate = bookEntity.validate();

      if (validate.isFail) {
        return {
          isFail: true,
          error: validate.error,
        };
      }

      return {
        isFail: false,
        success: { value: bookEntity },
      };
    } catch (error: any) {
      return {
        isFail: true,
        error: {
          message: error.message ?? 'Houve um erro ao encontrar o livro',
        },
      };
    }
  }

  public async findByTitle(title: string): Promise<Response<Book>> {
    try {
      const result = await this.query<BookProps>(
        'Erro ao buscar livro por título',
        `SELECT ${this.BOOK_COLUMNS} FROM livros WHERE LOWER(title) = LOWER($1) LIMIT 1`,
        [title],
      );
      const book = result.rows[0];

      if (!book) {
        return {
          isFail: true,
          error: { message: 'Registro não encontrado' },
        };
      }

      const bookEntity = new Book(book);
      const validate = bookEntity.validate();

      if (validate.isFail) {
        return {
          isFail: true,
          error: validate.error,
        };
      }

      return {
        isFail: false,
        success: { value: bookEntity },
      };
    } catch (error: any) {
      return {
        isFail: true,
        error: {
          message:
            error.message ?? 'Houve um erro ao encontrar o livro pelo título',
        },
      };
    }
  }

  public async update(book: Book): Promise<Response<void>> {
    try {
      await this.query(
        'Erro ao atualizar livro',
        `UPDATE livros
           SET title = COALESCE($1, title),
               autor = COALESCE($2, autor),
               ano = COALESCE($3, ano)
           WHERE id = $4`,
        [book.title, book.autor, book.ano, book.id],
      );

      return {
        isFail: false,
      };
    } catch (error: any) {
      return {
        isFail: true,
        error: {
          message: error.message ?? 'Houve um erro ao encontrar o livro',
        },
      };
    }
  }

  public async disable(id: string): Promise<Response<void>> {
    try {
      await this.query(
        'Erro ao inativar livro',
        'UPDATE livros SET ativo = FALSE WHERE id = $1',
        [id],
      );

      return {
        isFail: false,
      };
    } catch (error: any) {
      return {
        isFail: true,
        error: {
          message: error.message ?? 'Houve um erro ao encontrar o livro',
        },
      };
    }
  }

  public async destroy(id: string): Promise<Response<void>> {
    try {
      await Promise.all([
        this.query(
          'Erro ao excluir empréstimos do livro',
          'DELETE FROM emprestimos WHERE livro_id = $1',
          [id],
        ),
        this.query(
          'Erro ao excluir livro',
          'DELETE FROM livros WHERE id = $1',
          [id],
        ),
      ]);

      return {
        isFail: false,
      };
    } catch (error: any) {
      return {
        isFail: true,
        error: {
          message: error.message ?? 'Houve um erro ao encontrar o livro',
        },
      };
    }
  }

  public async reactivate(id: string): Promise<Response<void>> {
    try {
      await this.query(
        'Erro ao reativar livro',
        'UPDATE livros SET ativo = TRUE WHERE id = $1 AND ativo = FALSE',
        [id],
      );

      return {
        isFail: false,
      };
    } catch (error: any) {
      return {
        isFail: true,
        error: {
          message: error.message ?? 'Houve um erro ao encontrar o livro',
        },
      };
    }
  }
}
