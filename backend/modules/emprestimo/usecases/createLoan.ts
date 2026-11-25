import { v4 as uuidv4 } from 'uuid';

import { ADMIN } from '../../../shared/authentication.js';
import {
  databaseStrategy,
  type DatabaseProvider,
} from '../../../shared/index.js';
import { FindBookUsecase } from '../../books/usecases/index.js';
import { USER_NOT_FOUND } from '../../user/repositories/index.js';
import { Loan } from '../entities/index.js';
import { loanFailure } from './types.js';
import type { IBookRepository } from '../../books/repositories/index.js';
import type { User } from '../../user/entities/index.js';
import type { IUserRepository } from '../../user/repositories/index.js';
import type { ILoanRepository } from '../repositories/index.js';
import type { LoanInput } from '../validator.js';
import type { LoanResponse } from './types.js';

export type LoanActor = { id: string; tipoUsu: string };

type LendBookInput = LoanInput & {
  usuarioResponsavelId: string;
};

export class LendBookUsecase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly loanRepository: ILoanRepository,
    private readonly bookRepository: IBookRepository,
  ) {}

  public async execute(data: LendBookInput): Promise<LoanResponse> {
    const usuario = await this.userRepository.findById(data.usuarioId);

    if (usuario.isFail) {
      return {
        isFail: true,
        error: {
          message: usuario.error?.message as string,
        },
      };
    }

    const responsavel = await this.userRepository.findById(
      data.usuarioResponsavelId,
    );

    if (responsavel.isFail) {
      return {
        isFail: true,
        error: {
          message: responsavel.error?.message as string,
        },
      };
    }

    const livro = await this.bookRepository.findById(data.livroId);

    if (livro.isFail) {
      return {
        isFail: true,
        error: {
          message: livro.error?.message as string,
        },
      };
    }

    const borrower = await this.findBorrower(data);

    if (borrower.isFail || !borrower.success) {
      return loanFailure(
        borrower.error?.metadata?.status ?? 500,
        borrower.error?.message ?? 'Erro ao identificar o usuário',
      );
    }

    const user = borrower.success.value;

    const findBook = new FindBookUsecase(this.bookRepository);
    const bookResult = await findBook.execute(data.livroId);

    if (bookResult.isFail || !bookResult.success) {
      return loanFailure(404, 'Livro não encontrado');
    }

    const book = bookResult.success.value;

    const active = await this.loanRepository.hasActiveLoan(data.livroId);

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

  private async findBorrower(data: LendBookInput): Promise<LoanResponse<User>> {
    if (actor.tipoUsu !== ADMIN) {
      const own = await this.userRepository.findById(actor.id);

      if (own.isFail || !own.success) {
        return own.error?.message === USER_NOT_FOUND
          ? loanFailure<User>(401, 'Usuário não encontrado')
          : loanFailure<User>(
              500,
              own.error?.message ?? 'Erro ao buscar usuário',
            );
      }

      return { isFail: false, success: own.success };
    }

    if (!data.cpf || !data.tel) {
      return loanFailure<User>(400, 'Informe o CPF e o telefone do usuário');
    }

    const found = await this.userRepository.findByCpf(data.cpf);

    if (found.isFail || !found.success) {
      return found.error?.message === USER_NOT_FOUND
        ? loanFailure<User>(400, 'CPF ou telefone inválido')
        : loanFailure<User>(
            500,
            found.error?.message ?? 'Erro ao buscar usuário',
          );
    }

    if (found.success.value.tel !== data.tel) {
      return loanFailure<User>(400, 'CPF ou telefone inválido');
    }

    return { isFail: false, success: found.success };
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
