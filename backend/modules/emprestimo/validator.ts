import { z } from 'zod';

const loanSchema = z
  .object({
    livroId: z.string().uuid('ID do livro inválido'),
    nome: z.string().min(1, 'Nome obrigatório'),
    tel: z.string().regex(/^\d{11}$/, 'Telefone deve conter 11 dígitos'),
    cpf: z.string().regex(/^\d{11}$/, 'O CPF deve conter 11 dígitos'),
    dataEmprestimo: z.string().min(1, 'Data do empréstimo obrigatória'),
    dataDevolucao: z.string().min(1, 'Data da devolução obrigatória'),
  })
  .refine(
    (dados) =>
      !Number.isNaN(Date.parse(dados.dataEmprestimo)) &&
      !Number.isNaN(Date.parse(dados.dataDevolucao)),
    {
      message: 'Informe datas válidas',
      path: ['dataEmprestimo'],
    },
  )
  .refine(
    (dados) =>
      new Date(dados.dataDevolucao).getTime() >
      new Date(dados.dataEmprestimo).getTime(),
    {
      message: 'A devolução deve ser posterior ao empréstimo',
      path: ['dataDevolucao'],
    },
  );

export type LoanInput = z.infer<typeof loanSchema>;

export function loanValidation(payload: unknown) {
  return loanSchema.safeParse(payload);
}
