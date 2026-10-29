import database from '../../database/db.js';

export type LoanListItem = {
  id: string;
  livroId: string;
  nome: string | null;
  nomeLivro: string;
  autor: string;
  ano: number;
  dataEmprestimo: Date;
  dataDevolucao: Date | null;
  devolvido: boolean;
}

export type NewLoan = {
  id: string; 
  livroId: string; 
  usuarioId: string; 
  nomeLivro: string; 
  autor: string; 
  ano: number; 
  dataEmprestimo: string;
  dataDevolucao: string;
  devolvido: boolean;
}

export type LoanRow = {
  id: string;
  livro_id: string;
  usuario_id: string;
  nome_livro: string;
  autor: string;
  ano: number;
  data_emprestimo: Date;
  data_devolucao: Date
  devolvido: boolean;
}

export async function listLoans(): Promise<LoanListItem[]> {
  const result = await database.query<LoanListItem>(`
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

export async function createLoan(loan: NewLoan): Promise<LoanRow | undefined> {
  const {
    id, livroId, usuarioId, nomeLivro, autor, ano,dataEmprestimo, dataDevolucao, devolvido} = loan;

  const result = await database.query<LoanRow>(
    `INSERT INTO emprestimos (
      id, livro_id, usuario_id, nome_livro, autor, ano,
      data_emprestimo, data_devolucao, devolvido
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *`,
    [id, livroId, usuarioId, nomeLivro, autor, ano,dataEmprestimo, dataDevolucao, devolvido],
  );

  return result.rows[0];
}

export async function findActiveLoan(bookId: string): Promise<{id: string } | null> {
  const result = await database.query<{ id: string }> (
    `SELECT id
     FROM emprestimos
     WHERE livro_id = $1 AND devolvido = FALSE
     LIMIT 1`,
    [bookId],
  );

  return result.rows[0] ?? null;
}

export async function returnLoan(loanId: string): Promise<boolean> {
  const result = await database.query(
    `UPDATE emprestimos
     SET devolvido = TRUE
     WHERE id = $1 AND devolvido = FALSE
     RETURNING id`,
    [loanId],
  );

  return (result.rowCount ?? 0)  > 0;
}