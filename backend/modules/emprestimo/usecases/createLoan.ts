import { v4 as uuidv4 } from 'uuid';
import { createLoan, findActiveLoan } from '../loan.js';
import { findBook } from '../../books/usecases/index.js';
import { findByCpf } from '../../user/repository.js';
import type { LoanRow } from '../loan.js';
import type { LoanInput } from '../validator.js';

export type LendError = { error: string };

export async function lendBook(data: LoanInput): Promise<LoanRow | LendError> {
  const { livroId, cpf, tel } = data;

  const user = await findByCpf(cpf);

  if (!user || user.tel !== tel) {
    return { error: 'CPF ou telefone inválido' };
  }

  const book = await findBook(livroId);

  if (!book) {
    return { error: 'Livro não encontrado' };
  }

  const activeLoan = await findActiveLoan(livroId);

  if (activeLoan) {
    return { error: 'Este livro já está emprestado' };
  }

  const loan = await createLoan({
    ...data,
    id: uuidv4(),
    usuarioId: user.id,
    nomeLivro: book.title,
    autor: book.autor,
    ano: book.ano,
    devolvido: false,
  });

  if (!loan) {
    throw new Error('Erro ao registrar empréstimo');
  }
  return loan;
}
