import { z } from 'zod';

const bookSchema = z.object({
  title: z.string().min(1, 'Titulo obrigatorio'),
  autor: z.string().min(1, 'Autor é obrigatorio'),
  ano: z
    .number()
    .int('O ano deve ser um número inteiro')
    .min(1900, 'O ano deve ser maior ou igual a 1900')
    .max(new Date().getFullYear(),'O ano não pode ser no futuro'),
});

export type BookInput = z.infer<typeof bookSchema>;

export function bookValidation(payload: unknown) {
  return bookSchema.safeParse(payload);
}
