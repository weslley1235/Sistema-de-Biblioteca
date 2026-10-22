import database from '../../database/db.js';

async function list() {
  try {
    const result = await database.query(
      `SELECT id, title, autor, ano FROM livros WHERE ativo = TRUE ORDER BY title`,
    );

    return result.rows;
  } catch (error) {
    throw new Error('Erro ao listar livros', { cause: error });
  }
}

async function listInactive() {
  try {
    const result = await database.query(
      `SELECT id, title, autor, ano FROM livros WHERE ativo = FALSE ORDER BY title`,
    );

    return result.rows;
  } catch (error) {
    throw new Error('Erro ao listar livros inativos', { cause: error });
  }
}

async function save(book) {
  try {
    const books = Array.isArray(book) ? book : [book];

    for (const item of books) {
      await database.query(
        `INSERT INTO livros (id, title, autor, ano) VALUES ($1, $2, $3, $4)`,
        [item.id, item.title, item.autor, item.ano],
      );
    }
  } catch (error) {
    throw new Error('Erro ao salvar livro', { cause: error });
  }
}

async function findById(id) {
  try {
    const result = await database.query(
      'SELECT id, title, autor, ano FROM livros WHERE id = $1',
      [id],
    );

    return result.rows[0];
  } catch (error) {
    throw new Error('Erro ao buscar livro por id', { cause: error });
  }
}

async function findByTitle(title) {
  try {
    const result = await database.query(
      `SELECT id, title, autor, ano FROM livros WHERE LOWER(title) = LOWER($1) LIMIT 1`,
      [title],
    );

    return result.rows[0];
  } catch (error) {
    throw new Error('Erro ao buscar livro por título', { cause: error });
  }
}

async function update(id, dados) {
  try {
    const book = await findById(id);

    if (!book) return false;

    const result = await database.query(
      `UPDATE livros SET title = $1, autor = $2, ano = $3 WHERE id = $4`,
      [dados.title ?? book.title, dados.autor ?? book.autor, dados.ano ?? book.ano, id],
    );

    return result.rowCount > 0;
  } catch (error) {
    throw new Error('Erro ao atualizar livro', { cause: error });
  }
}

async function destroy(id, definitive = false) {
  try {
    if (definitive) {
      await database.query('DELETE FROM emprestimos WHERE livro_id = $1', [id]);

      const result = await database.query(
        'DELETE FROM livros WHERE id = $1',
        [id],
      );

      return result.rowCount > 0;
    }

    const result = await database.query(
      'UPDATE livros SET ativo = FALSE WHERE id = $1',
      [id],
    );

    return result.rowCount > 0;
  } catch (error) {
    throw new Error('Erro ao excluir livro', { cause: error });
  }
}

async function reactivate(id) {
  try {
    const result = await database.query(
      `UPDATE livros SET ativo = TRUE WHERE id = $1 AND ativo = FALSE`,
      [id],
    );

    return result.rowCount > 0;
  } catch (error) {
    throw new Error('Erro ao reativar livro', { cause: error });
  }
}

export { list, listInactive, save, findById, findByTitle, update, destroy, reactivate };


/*

import database from '../../database/db.js';

const BOOK_COLUMNS = 'id, title, autor, ano';

async function query(errorMessage, sql, params = []) {
  try {
    return await database.query(sql, params);
  } catch (error) {
    throw new Error(errorMessage, { cause: error });
  }
}

async function list() {
  const result = await query(
    'Erro ao listar livros',
    `SELECT ${BOOK_COLUMNS} FROM livros WHERE ativo = TRUE ORDER BY title`,
  );

  return result.rows;
}

async function listInactive() {
  const result = await query(
    'Erro ao listar livros inativos',
    `SELECT ${BOOK_COLUMNS} FROM livros WHERE ativo = FALSE ORDER BY title`,
  );

  return result.rows;
}

async function save(book) {
  const books = Array.isArray(book) ? book : [book];

  for (const { id, title, autor, ano } of books) {
    await query(
      'Erro ao salvar livro',
      'INSERT INTO livros (id, title, autor, ano) VALUES ($1, $2, $3, $4)',
      [id, title, autor, ano],
    );
  }
}

async function findById(id) {
  const result = await query(
    'Erro ao buscar livro por id',
    `SELECT ${BOOK_COLUMNS} FROM livros WHERE id = $1`,
    [id],
  );

  return result.rows[0];
}

async function findByTitle(title) {
  const result = await query(
    'Erro ao buscar livro por título',
    `SELECT ${BOOK_COLUMNS} FROM livros WHERE LOWER(title) = LOWER($1) LIMIT 1`,
    [title],
  );

  return result.rows[0];
}

async function update(id, { title, autor, ano }) {
  const result = await query(
    'Erro ao atualizar livro',
    `UPDATE livros
     SET title = COALESCE($1, title),
         autor = COALESCE($2, autor),
         ano = COALESCE($3, ano)
     WHERE id = $4`,
    [title, autor, ano, id],
  );

  return result.rowCount > 0;
}

async function destroy(id, definitive = false) {
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

    return result.rowCount > 0;
  }

  const result = await query(
    'Erro ao inativar livro',
    'UPDATE livros SET ativo = FALSE WHERE id = $1',
    [id],
  );

  return result.rowCount > 0;
}

async function reactivate(id) {
  const result = await query(
    'Erro ao reativar livro',
    'UPDATE livros SET ativo = TRUE WHERE id = $1 AND ativo = FALSE',
    [id],
  );

  return result.rowCount > 0;
}

export { list, listInactive, save, findById, findByTitle, update, destroy, reactivate };

*/