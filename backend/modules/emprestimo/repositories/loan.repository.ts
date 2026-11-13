import type { QueryResult, QueryResultRow } from 'pg';

import database from '../../../../database/db.js';
import type { Response } from '../../../shared/index.js';
import type { Loan } from '../entities/index.js';
import { LOAN_NOT_FOUND } from './loan.repository.interface.js';
import type {
  ILoanRepository,
  LoanListItem,
} from './loan.repository.interface.js';

export class LoanRepository implements ILoanRepository {
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

  private fail<T>(error: unknown, fallback: string): Response<T> {
    return {
      isFail: true,
      error: { message: error instanceof Error ? error.message : fallback },
    };
  }

  public async save(loan: Loan): Promise<Response<void>> {
    try {
      await this.query(
        'Erro ao registrar empréstimo',
        `INSERT INTO emprestimos (
          id, livro_id, usuario_id, nome_livro, autor, ano,
          data_emprestimo, data_devolucao, devolvido
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
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
    } catch (error) {
      return this.fail(error, 'Houve um erro ao registrar o empréstimo');
    }
  }

  public async list(): Promise<Response<Array<LoanListItem>>> {
    try {
      const result = await this.query<LoanListItem>(
        'Erro ao listar empréstimos',
        `SELECT
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
         ORDER BY data_emprestimo DESC`,
      );

      return { isFail: false, success: { value: result.rows } };
    } catch (error) {
      return this.fail(error, 'Houve um erro ao listar os empréstimos');
    }
  }

  public async hasActiveLoan(bookId: string): Promise<Response<boolean>> {
    try {
      const result = await this.query(
        'Erro ao verificar empréstimo ativo',
        `SELECT 1 FROM emprestimos
         WHERE livro_id = $1 AND devolvido = FALSE
         LIMIT 1`,
        [bookId],
      );

      return {
        isFail: false,
        success: { value: (result.rowCount ?? 0) > 0 },
      };
    } catch (error) {
      return this.fail(error, 'Houve um erro ao verificar o empréstimo');
    }
  }

  public async returnLoan(id: string): Promise<Response<void>> {
    try {
      const result = await this.query(
        'Erro ao devolver livro',
        `UPDATE emprestimos
         SET devolvido = TRUE
         WHERE id = $1 AND devolvido = FALSE`,
        [id],
      );

      if ((result.rowCount ?? 0) === 0) {
        return { isFail: true, error: { message: LOAN_NOT_FOUND } };
      }

      return { isFail: false };
    } catch (error) {
      return this.fail(error, 'Houve um erro ao devolver o livro');
    }
  }
}
