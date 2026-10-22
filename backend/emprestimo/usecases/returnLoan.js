import { returnLoan as returnLoanRepository } from '../loan.js';

export async function returnLoan(id) {
  return await returnLoanRepository(id);
}