import { LoanRepository } from '../repositories/index.js';
import type { LoanListItem } from '../repositories/index.js';
import { loanFailure } from './types.js';
import type { LoanResponse } from './types.js';

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
