import type { Response } from '../../../shared/index.js';
import type { Loan } from '../entities/index.js';

export type LoanListItem = {
  id: string;
  livroId: string;
  nome: string | null;
  nomeLivro: string;
  autor: string;
  ano: number;
  dataEmprestimo: string;
  dataDevolucao: string | null;
  devolvido: boolean;
};

export const LOAN_NOT_FOUND = 'Empréstimo não encontrado';

export interface ILoanRepository {
  save(loan: Loan): Promise<Response<void>>;
  list(): Promise<Response<Array<LoanListItem>>>;
  hasActiveLoan(bookId: string): Promise<Response<boolean>>;
  returnLoan(id: string): Promise<Response<void>>;
}