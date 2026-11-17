
import { v4 as uuidv4 } from 'uuid';

import { FindBookUsecase } from '../../books/usecases/index';
import { USER_NOT_FOUND } from '../../user/repositories/index';
import { Loan } from '../entities/index';
import { loanFailure } from './types';

import type { IBookRepository } from '../../books/repositories/index';
import type { IUserRepository } from '../../user/repositories/index';
import type { ILoanRepository } from '../repositories/index';
import type { LoanInput } from '../validator';
import type { LoanResponse } from './types';

export class LendBookUsecase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly loanRepository: ILoanRepository,
    private readonly bookRepository: IBookRepository,
  ) {}

  public async execute(data: LoanInput): Promise<LoanResponse> {
    const { livroId, cpf, tel } = data;

    const found = await this.userRepository.findByCpf(cpf);

    if (found.isFail || !found.success) {
      if (found.error?.message === USER_NOT_FOUND) {
        return loanFailure(400, 'CPF ou telefone inválido');
      }

      return loanFailure(500, found.error?.message ?? 'Erro ao buscar usuário');
    }

    const user = found.success.value;

    if (user.tel !== tel) {
      return loanFailure(400, 'CPF ou telefone inválido');
    }

    const findBook = new FindBookUsecase(this.bookRepository);
    const bookResult = await findBook.execute(livroId);

    if (bookResult.isFail || !bookResult.success) {
      return loanFailure(404, 'Livro não encontrado');
    }

    const book = bookResult.success.value;

    const active = await this.loanRepository.hasActiveLoan(livroId);

    if (active.isFail) {
      return loanFailure(
        500,
        active.error?.message ?? 'Erro ao verificar empréstimo',
      );
    }

    if (active.success?.value) {
      return loanFailure(409, 'Este livro já está emprestado');
    }

    const loan = new Loan({
      id: uuidv4(),
      livroId,
      usuarioId: user.id,
      nomeLivro: book.title,
      autor: book.autor,
      ano: book.ano,
      dataEmprestimo: data.dataEmprestimo,
      dataDevolucao: data.dataDevolucao,
      devolvido: false,
    });

    const validation = loan.validate();

    if (validation.isFail) {
      return loanFailure(
        400,
        validation.error?.message ?? 'Empréstimo inválido',
      );
    }

    const saved = await this.loanRepository.save(loan);

    if (saved.isFail) {
      return loanFailure(
        500,
        saved.error?.message ?? 'Erro ao registrar empréstimo',
      );
    }

    return { isFail: false };
  }
}
