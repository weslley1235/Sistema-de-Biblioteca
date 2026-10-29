import { returnLoan as returnLoanRepository } from '../loan.js';

export async function returnLoan(id: string): Promise<boolean> {
  return await returnLoanRepository(id);
}