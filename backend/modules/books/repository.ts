import type { QueryResult, QueryResultRow } from 'pg';

import database from '../../../database/db.js';
import type { Response } from '../../shared/index.js';
import type { BookProps } from './entities/index.js';
import type { BookInput } from './validator.js';

export type Book = {
  id: string;
  title: string;
  autor: string;
  ano: number;
};

const BOOK_COLUMNS = 'id, title, autor, ano';

async function query<T extends QueryResultRow = QueryResultRow>(
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

async function list(): Promise<Book[]> {
  const result = await query<Book>(
    'Erro ao listar livros',
    `SELECT ${BOOK_COLUMNS} FROM livros WHERE ativo = TRUE ORDER BY title`,
  );

  return result.rows;
}

async function listInactive(): Promise<Book[]> {
  const result = await query<Book>(
    'Erro ao listar livros inativos',
    `SELECT ${BOOK_COLUMNS} FROM livros WHERE ativo = FALSE ORDER BY title`,
  );

  return result.rows;
}

async function save(book: Book | Book[]): Promise<void> {
  const books = Array.isArray(book) ? book : [book];

  for (const { id, title, autor, ano } of books) {
    await query(
      'Erro ao salvar livro',
      'INSERT INTO livros (id, title, autor, ano) VALUES ($1, $2, $3, $4)',
      [id, title, autor, ano],
    );
  }
}

async function findById(id: string): Promise<Response<BookProps>> {
  const result = await query<BookProps>(
    'Erro ao buscar livro por id',
    `SELECT ${BOOK_COLUMNS} FROM livros WHERE id = $1`,
    [id],
  );

  const book = result.rows[0];

  if (!book) {
    return {
      isFail: true,
      error: { message: 'Registro não encontrado' },
    };
  }

  return {
    isFail: false,
    success: { value: book },
  };
}

async function findByTitle(title: string): Promise<Book | undefined> {
  const result = await query<Book>(
    'Erro ao buscar livro por título',
    `SELECT ${BOOK_COLUMNS} FROM livros WHERE LOWER(title) = LOWER($1) LIMIT 1`,
    [title],
  );

  return result.rows[0];
}

async function update(id: string,{ title, autor, ano }: BookInput): Promise<boolean> {
  const result = await query(
    'Erro ao atualizar livro',
    `UPDATE livros
     SET title = COALESCE($1, title),
         autor = COALESCE($2, autor),
         ano = COALESCE($3, ano)
     WHERE id = $4`,
    [title, autor, ano, id],
  );

  return (result.rowCount ?? 0) > 0;
}

async function destroy(id: string, definitive = false): Promise<boolean> {
  if (definitive) {
    await query(
      'Erro ao excluir empréstimos do livro',
      'DELETE FROM emprestimos WHERE livro_id = $1',
      [id],
    );

    const result = await query(
      'Erro ao excluir livro',
      'DELETE FROM livros WHERE id = $1',
      [id],
    );

    return (result.rowCount ?? 0) > 0;
  }

  const result = await query(
    'Erro ao inativar livro',
    'UPDATE livros SET ativo = FALSE WHERE id = $1',
    [id],
  );

  return (result.rowCount ?? 0) > 0;
}

async function reactivate(id: string): Promise<boolean> {
  const result = await query(
    'Erro ao reativar livro',
    'UPDATE livros SET ativo = TRUE WHERE id = $1 AND ativo = FALSE',
    [id],
  );

  return (result.rowCount ?? 0) > 0;
}

export {
  list,
  listInactive,
  save,
  findById,
  findByTitle,
  update,
  destroy,
  reactivate,
};
