import fs from 'node:fs';
import { z } from 'zod';

const filePath = './banco/emprestimo.json';

export const loanSchema = z.object({
  livroId: z.string().min(1, 'ID do livro obrigatório'),
  nome: z.string().min(1, 'Nome obrigatório'),
  tel: z.string().regex(/^\d{11}$/, 'Telefone deve conter 11 digitos'),
  cpf: z.string().regex(/^\d{11}$/, 'O CPF deve conter 11 dígitos'),
  dataEmprestimo: z.string().min(1, 'Data do empréstimo obrigatória'),
  dataDevolucao: z.string().min(1, 'Data da devolução obrigatória'),
});

export function listLoans() {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  } catch (error) {
    throw new Error(error.message);
  }
}

function saveLoans(loans) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(loans, null, 2));
  
  } catch (error) {
    throw new Error(error.message);
  }
}

export function createLoan(loan) {
  try {
    const loans = listLoans();
    loans.push(loan);
    saveLoans(loans);
    return loan;
  
  } catch (error) {
    throw new Error(error.message);
  }
}

export function findActiveLoan(bookId) {
  try {
    const loans = listLoans()
    return loans.find((loan) => loan.livroId === bookId && !loan.devolvido);
  
  } catch (error) {
    throw new Error(error.message);
  }
}

export function returnLoan(loanId) {
  try{
  const loans = listLoans();
  const loan = loans.find((item) => item.id === loanId);

  if (!loan || loan.devolvido) {
    return false;
  }

  loan.devolvido = true;
  saveLoans(loans);
  return true;

  } catch ( error ){
    throw new Error( error.message);
  }
}
