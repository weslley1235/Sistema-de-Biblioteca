import { LOAN_NOT_FOUND } from '../repositories/index';
import type { ILoanRepository } from '../repositories/index'
import { loanFailure } from './types';
import type { LoanResponse } from './types';

export class ReturnLoanUsecase {
  constructor(private readonly repository: ILoanRepository) {}

  public async execute(id: string): Promise<LoanResponse> {
    const result = await this.repository.returnLoan(id);

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
