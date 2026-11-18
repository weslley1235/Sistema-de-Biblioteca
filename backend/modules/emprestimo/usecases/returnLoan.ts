import {databaseStrategy,type DatabaseProvider} from '../../../shared/index.js';
import { LOAN_NOT_FOUND } from '../repositories/index.js';
import { loanFailure } from './types.js';
import type { ILoanRepository } from '../repositories/index.js';
import type { LoanResponse } from './types.js';

export class ReturnLoanUsecase {
  constructor(private readonly loanRepository: ILoanRepository) {}

  public async execute(id: string): Promise<LoanResponse> {
    const result = await this.loanRepository.returnLoan(id);

    if (result.isFail) {
      if (result.error?.message === LOAN_NOT_FOUND) {
        return loanFailure(404, LOAN_NOT_FOUND);
      }

      return loanFailure(
        500,
        result.error?.message ?? 'Erro ao devolver livro',
      );
    }

    return { isFail: false };
  }
}

export class ReturnLoanFactory {
  public static factory(provider: DatabaseProvider) {
    return new ReturnLoanUsecase(databaseStrategy[provider]().loan);
  }
}
