import { v4 as uuidv4 } from 'uuid';

import {databaseStrategy,type DatabaseProvider} from '../../../shared/index.js';
import { USER_NOT_FOUND } from '../../user/repositories/index.js';
import { Loan } from '../entities/index.js';
import { resolveBorrowerId, type LoanActor } from './loanPolicy.js';
import { loanFailure } from './types.js';
import type { IBookRepository } from '../../books/repositories/index.js';
import type { IUserRepository } from '../../user/repositories/index.js';
import type { ILoanRepository } from '../repositories/index.js';
import type { LoanInput } from '../validator.js';
import type { LoanResponse } from './types.js';

export class LendBookUsecase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly loanRepository: ILoanRepository,
    private readonly bookRepository: IBookRepository,
  ) {}

  public async execute(
    data: LoanInput,
    actor: LoanActor,
  ): Promise<LoanResponse> {
    const responsavel = await this.userRepository.findById(actor.id);

    if (responsavel.isFail || !responsavel.success) {
      return loanFailure(
        401,
        responsavel.error?.message ?? 'Usuário responsável não encontrado',
      );
    }

    const livro = await this.bookRepository.findById(data.livroId);

    if (livro.isFail || !livro.success) {
      return loanFailure(404, livro.error?.message ?? 'Livro não encontrado');
    }

    const borrowerId = resolveBorrowerId(actor, data.usuarioId);
    
    const borrower =
      borrowerId === actor.id
        ? responsavel
        : await this.userRepository.findById(borrowerId);

    if (borrower.isFail || !borrower.success) {
      const notFound = borrower.error?.message === USER_NOT_FOUND;

      return loanFailure(
        notFound ? 400 : 500,
        borrower.error?.message ?? 'Erro ao identificar o usuário',
      );
    }

    const user = borrower.success.value;
    const book = livro.success.value;

    const active = await this.loanRepository.hasActiveLoan(data.livroId);

    if (active.isFail || !active.success) {
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
      livroId: data.livroId,
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

export class LendBookFactory {
  public static factory(provider: DatabaseProvider) {
    const repositoryProvider = databaseStrategy[provider]();

    return new LendBookUsecase(
      repositoryProvider.user,
      repositoryProvider.loan,
      repositoryProvider.book,
    );
  }
}
