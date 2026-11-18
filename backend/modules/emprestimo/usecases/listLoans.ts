import { ADMIN } from '../../../shared/authentication.js';
import {databaseStrategy,type DatabaseProvider} from '../../../shared/index.js';
import { loanFailure } from './types.js';
import type { ILoanRepository, LoanListItem } from '../repositories/index.js';
import type { LoanResponse } from './types.js';

type Actor = { id: string; tipoUsu: string };

export class ListLoansUsecase {
  constructor(private readonly loanRepository: ILoanRepository) {}

  public async execute(
    actor: Actor,
  ): Promise<LoanResponse<Array<LoanListItem>>> {
    const result =
      actor.tipoUsu === ADMIN
        ? await this.loanRepository.list()
        : await this.loanRepository.listByUser(actor.id);

    if (result.isFail || !result.success) {
      return loanFailure(
        500,
        result.error?.message ?? 'Erro ao listar empréstimos',
      );
    }

    return { isFail: false, success: result.success };
  }
}

export class ListActiveBookIdsUsecase {
  constructor(private readonly loanRepository: ILoanRepository) {}

  public async execute(): Promise<LoanResponse<Array<string>>> {
    const result = await this.loanRepository.listActiveBookIds();

    if (result.isFail || !result.success) {
      return loanFailure(
        500,
        result.error?.message ?? 'Erro ao listar livros emprestados',
      );
    }

    return { isFail: false, success: result.success };
  }
}

export class ListLoansFactory {
  public static factory(provider: DatabaseProvider) {
    return new ListLoansUsecase(databaseStrategy[provider]().loan);
  }
}

export class ListActiveBookIdsFactory {
  public static factory(provider: DatabaseProvider) {
    return new ListActiveBookIdsUsecase(databaseStrategy[provider]().loan);
  }
}
