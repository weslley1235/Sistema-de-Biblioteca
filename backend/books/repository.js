
import database from '../../database/db.js';

async function list() {
  const result = await database.query(
    `SELECT id, title, autor, ano FROM livros WHERE ativo = TRUE ORDER BY title`);
  return result.rows;
}

async function listInactive() {
  const result = await database.query(
    `SELECT id, title, autor, ano FROM livros WHERE ativo = FALSE ORDER BY title`);
  return result.rows;
}

async function save(book) {
  const books = Array.isArray(book) ? book : [book];

  for (const item of books) {
    await database.query(
      `INSERT INTO livros (id, title, autor, ano) VALUES ($1, $2, $3, $4)`,
      [item.id, item.title, item.autor, item.ano],
    );
  }
}

async function findById(id) {
  const result = await database.query(
    'SELECT id, title, autor, ano FROM livros WHERE id = $1',
    [id],
  );

  return result.rows[0];
}

async function findByTitle(title) {
  const result = await database.query(
    `SELECT id, title, autor, ano FROM livros WHERE LOWER(title) = LOWER($1) LIMIT 1`,
    [title],
  );

  return result.rows[0];
}

async function update(id, dados) {
  const book = await findById(id);

  if (!book) return false;

  const result = await database.query(
    `UPDATE livros SET title = $1, autor = $2, ano = $3 WHERE id = $4`,
    [dados.title ?? book.title, dados.autor ?? book.autor, dados.ano ?? book.ano, id],
  );

  return result.rowCount > 0;
}

async function destroy(id, definitive = false) {
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
}

async function reactivate(id) {
  const result = await database.query(
    `UPDATE livros SET ativo = TRUE WHERE id = $1 AND ativo = FALSE`,
    [id],
  );

  return result.rowCount > 0;
}

export {list,listInactive,save,findById,findByTitle,update,destroy,reactivate};
