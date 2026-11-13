import { v4 as uuidv4 } from 'uuid';

import { FindBookUsecase } from '../../books/usecases/index.js';
import {UserRepository,USER_NOT_FOUND} from '../../user/repositories/index.js';
import { Loan } from '../entities/index.js';
import { LoanRepository } from '../repositories/index.js';
import type { LoanInput } from '../validator.js';
import { loanFailure } from './types.js';
import type { LoanResponse } from './types.js';

export class LendBookUsecase {
  public async execute(data: LoanInput): Promise<LoanResponse> {
    const { livroId, cpf, tel } = data;

    const found = await new UserRepository().findByCpf(cpf);

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

    const bookResult = await new FindBookUsecase().execute(livroId);

    if (bookResult.isFail || !bookResult.success) {
      return loanFailure(404, 'Livro não encontrado');
    }

    const book = bookResult.success.value;
    const repository = new LoanRepository();

    const active = await repository.hasActiveLoan(livroId);

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

    const saved = await repository.save(loan);

    if (saved.isFail) {
      return loanFailure(
        500,
        saved.error?.message ?? 'Erro ao registrar empréstimo',
      );
    }

    return { isFail: false };
  }
}
