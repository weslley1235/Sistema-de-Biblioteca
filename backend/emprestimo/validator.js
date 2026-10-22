import { z } from 'zod';

const loanSchema = z.object({
  livroId: z.string().uuid('ID do livro inválido'),
  nome: z.string().min(1, 'Nome obrigatório'),
  tel: z.string().regex(/^\d{11}$/, 'Telefone deve conter 11 dígitos'),
  cpf: z.string().regex(/^\d{11}$/, 'O CPF deve conter 11 dígitos'),
  dataEmprestimo: z.string().min(1, 'Data do empréstimo obrigatória'),
  dataDevolucao: z.string().min(1, 'Data da devolução obrigatória'),
});

export function loanValidation(payload) {
  return loanSchema.safeParse(payload);
}