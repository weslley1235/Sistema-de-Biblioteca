import { listLoans as listLoansRepository } from '../loan.js';

export async function listLoans() {
  return await listLoansRepository();
}