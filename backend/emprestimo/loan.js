import database from '../../database/db.js';

export async function listLoans() {
  const result = await database.query(`
    SELECT
      id,
      livro_id AS "livroId",
      (SELECT nome FROM usuarios WHERE usuarios.id = emprestimos.usuario_id) AS nome,
      nome_livro AS "nomeLivro",
      autor,
      ano,
      data_emprestimo AS "dataEmprestimo",
      data_devolucao AS "dataDevolucao",
      devolvido
    FROM emprestimos
    ORDER BY data_emprestimo DESC
  `);

  return result.rows;
}

export async function createLoan(loan) {
  const {
    id, livroId, usuarioId, nomeLivro, autor, ano,
    dataEmprestimo, dataDevolucao, devolvido,
  } = loan;

  const result = await database.query(
    `INSERT INTO emprestimos (
      id, livro_id, usuario_id, nome_livro, autor, ano,
      data_emprestimo, data_devolucao, devolvido
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *`,
    [
      id, livroId, usuarioId, nomeLivro, autor, ano,
      dataEmprestimo, dataDevolucao, devolvido,
    ],
  );

  return result.rows[0];
}

export async function findActiveLoan(bookId) {
  const result = await database.query(
    `SELECT id
     FROM emprestimos
     WHERE livro_id = $1 AND devolvido = FALSE
     LIMIT 1`,
    [bookId],
  );

  return result.rows[0] ?? null;
}

export async function returnLoan(loanId) {
  const result = await database.query(
    `UPDATE emprestimos
     SET devolvido = TRUE
     WHERE id = $1 AND devolvido = FALSE
     RETURNING id`,
    [loanId],
  );

  return result.rowCount > 0;
}