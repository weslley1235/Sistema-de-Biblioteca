import { v4 as uuidv4 } from 'uuid';
import { createLoan, findActiveLoan } from '../loan.js';
import { findBook } from '../../books/usecases/index.js';
import { findByCpf } from '../../user/repository.js';

export function lendBook(data) {
  const { livroId, cpf, tel } = data;

  const user = findByCpf(cpf)

  if (!user || user.tel !== tel ) {
    return { error: 'CPF ou telefone inválido' };
  }

  if (!findBook(livroId)) {
    return { error: 'Livro não encontrado' };
  }

  if (findActiveLoan(livroId)) {
    return { error: 'Este livro já está emprestado' };
  }

  return createLoan({ ...data, id: uuidv4(), devolvido: false });
}

