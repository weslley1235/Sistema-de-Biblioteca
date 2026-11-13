import type { Response } from '../../../shared/index.js';

export type LoanFailure = { status: number };
export type LoanResponse<T = void> = Response<T, LoanFailure>;

export function loanFailure<T = void>(
  status: number,
  message: string,
): LoanResponse<T> {
  return { isFail: true, error: { message, metadata: { status } } };
}
