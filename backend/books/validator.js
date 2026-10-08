import { z } from 'zod';

const livroSchema = z.object({
  titulo: z.string().min(1, 'Titulo obrigatorio'),
  autor: z.string().min(1, 'Autor é obrigatorio'),
  ano: z.number().min(1, 'Ano é obrigatorio'),
});

export function bookValidation(payload) {
  livroSchema.safeParse(payload);
}
