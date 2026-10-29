import { listLoans as listLoansRepository } from '../loan.js';
import type { LoanListItem } from '../loan.js';

export async function listLoans(): Promise<LoanListItem[]> {
  return await listLoansRepository();
}