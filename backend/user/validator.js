import { z } from 'zod';

const userSchema = z.object({
  nome: z.string().min(1, 'Nome obrigatorio'),
  email: z.string().email('Email invalido'),
  cpf: z.string().regex(/^\d{11}$/, 'O CPF deve conter 11 dígitos'),
  tel: z.string().regex(/^\d{11}$/, 'O Telefone deve conter 11 dígitos'),
  tipoUsu: z.string().min(1, 'Tipo de usuario obrigatorio'),
  password: z.string().min(1, 'Password obrigatorio'),
});

const userLoginSchema = z.object({
  email: z.string().email('Email ou password invalidos!'),
  password: z.string().min(8, 'Email ou password invalidos!'),
});

const userUpdateSchema = userSchema
  .pick({ nome: true, email: true, tel: true })
  .extend({ cpf: userSchema.shape.cpf.optional() });

export function userValidation(data) {
  return userSchema.safeParse(data);
}

export function userLoginValidation(data) {
  return userLoginSchema.safeParse(data);
}

export function userUpdateValidation(data) {
  return userUpdateSchema.safeParse(data);
}