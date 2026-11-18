
import type { ResultSetHeader, RowDataPacket } from 'mysql2/promise';

import mysqlDatabase from '../../../../database/mysql';
import { LOAN_NOT_FOUND } from './loan.repository.interface.js';
import type { Response } from '../../../shared/index.js';
import type { Loan } from '../entities/index.js';
import type {ILoanRepository,LoanListItem} from './loan.repository.interface.js';

type LoanRow = RowDataPacket &
  Omit<LoanListItem, 'devolvido'> & { devolvido: number };

export class MysqlLoanRepository implements ILoanRepository {
  private async attempt<T>(
    fallback: string,
    action: () => Promise<Response<T>>,
  ): Promise<Response<T>> {
    try {
      return await action();
    } catch (error) {
      return {
        isFail: true,
        error: { message: error instanceof Error ? error.message : fallback },
      };
    }
  }

  public async save(loan: Loan): Promise<Response<void>> {
    return this.attempt('Houve um erro ao registrar o empréstimo', async () => {
      await mysqlDatabase.query(
        `INSERT INTO emprestimos (
          id, livro_id, usuario_id, nome_livro, autor, ano,
          data_emprestimo, data_devolucao, devolvido
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          loan.id,
          loan.livroId,
          loan.usuarioId,
          loan.nomeLivro,
          loan.autor,
          loan.ano,
          loan.dataEmprestimo,
          loan.dataDevolucao,
          loan.devolvido,
        ],
      );

      return { isFail: false };
    });
  }

  public async list(): Promise<Response<Array<LoanListItem>>> {
    return this.attempt('Houve um erro ao listar os empréstimos', async () => {
      const [rows] = await mysqlDatabase.query<LoanRow[]>(
        `SELECT
           e.id,
           e.livro_id AS livroId,
           u.nome AS nome,
           e.nome_livro AS nomeLivro,
           e.autor,
           e.ano,
           e.data_emprestimo AS dataEmprestimo,
           e.data_devolucao AS dataDevolucao,
           e.devolvido
         FROM emprestimos e
         LEFT JOIN usuarios u ON u.id = e.usuario_id
         ORDER BY e.data_emprestimo DESC`,
      );

      const value = rows.map((row) => ({
        ...row,
        devolvido: Boolean(row.devolvido),
      }));

      return { isFail: false, success: { value } };
    });
  }

  public async listByUser(
    userId: string,
  ): Promise<Response<Array<LoanListItem>>> {
    return this.attempt('Houve um erro ao listar empréstimos do usuário', async () => {
      const [rows] = await mysqlDatabase.query<LoanRow[]>(
        `SELECT
           e.id,
           e.livro_id AS livroId,
           u.nome AS nome,
           e.nome_livro AS nomeLivro,
           e.autor,
           e.ano,
           e.data_emprestimo AS dataEmprestimo,
           e.data_devolucao AS dataDevolucao,
           e.devolvido
         FROM emprestimos e
         LEFT JOIN usuarios u ON u.id = e.usuario_id
         WHERE e.usuario_id = ?
         ORDER BY e.data_emprestimo DESC`,
        [userId],
      );

      const value = rows.map((row) => ({
        ...row,
        devolvido: Boolean(row.devolvido),
      }));

      return { isFail: false, success: { value } };
    });
  }

  public async listActiveBookIds(): Promise<Response<Array<string>>> {
    return this.attempt('Houve um erro ao listar livros emprestados', async () => {
      const [rows] = await mysqlDatabase.query<RowDataPacket[]>(
        `SELECT DISTINCT livro_id
         FROM emprestimos
         WHERE devolvido = FALSE`,
      );

      const value = rows.map((row) => row.livro_id as string);

      return { isFail: false, success: { value } };
    });
  }

  public async hasActiveLoan(bookId: string): Promise<Response<boolean>> {
    return this.attempt('Houve um erro ao verificar o empréstimo', async () => {
      const [rows] = await mysqlDatabase.query<RowDataPacket[]>(
        `SELECT 1 FROM emprestimos
         WHERE livro_id = ? AND devolvido = FALSE
         LIMIT 1`,
        [bookId],
      );

      return { isFail: false, success: { value: rows.length > 0 } };
    });
  }

  public async returnLoan(id: string): Promise<Response<void>> {
    return this.attempt('Houve um erro ao devolver o livro', async () => {
      const [result] = await mysqlDatabase.query<ResultSetHeader>(
        `UPDATE emprestimos
         SET devolvido = TRUE
         WHERE id = ? AND devolvido = FALSE`,
        [id],
      );

      return result.affectedRows === 0
        ? { isFail: true, error: { message: LOAN_NOT_FOUND } }
        : { isFail: false };
    });
  }
}
