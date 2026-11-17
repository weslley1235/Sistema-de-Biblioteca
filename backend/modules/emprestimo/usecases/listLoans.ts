import { LoanRepository } from '../repositories/index';
import type { LoanListItem } from '../repositories/index';
import { loanFailure } from './types';
import type { LoanResponse } from './types';

export class ListLoansUsecase {
  public async execute(): Promise<LoanResponse<Array<LoanListItem>>> {
    const result = await new LoanRepository().list();

    if (result.isFail || !result.success) {
      return loanFailure(
        500,
        result.error?.message ?? 'Erro ao listar empréstimos',
      );
    }

    return { isFail: false, success: result.success };
  }
}
