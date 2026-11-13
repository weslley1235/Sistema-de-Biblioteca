import { LoanRepository, LOAN_NOT_FOUND } from '../repositories/index.js';
import { loanFailure } from './types.js';
import type { LoanResponse } from './types.js';

export class ReturnLoanUsecase {
  public async execute(id: string): Promise<LoanResponse> {
    const result = await new LoanRepository().returnLoan(id);

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
