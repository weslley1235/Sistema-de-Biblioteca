import { z } from 'zod';

const userSchema = z.object({
  nome: z.string().min(1, 'Nome obrigatorio'),
  email: z.string().email('Email invalido'),
  cpf: z.string().regex(/^\d{11}$/, 'O CPF deve conter 11 dígitos'),
  tel: z.string().regex(/^\d{11}$/, 'O Telefone deve conter 11 dígitos'),
  tipoUsu: z.string().min(1, 'Tipo de usuario obrigatorio'),
  password: z.string().min(1, 'Senha obrigatorio'),
});

const userLoginSchema = z.object({
  email: z.string().email('Email ou senha invalidos!'),
  password: z.string().min(8, 'Email ou senha invalidos!'),
});

const userUpdateSchema = userSchema
  .pick({ nome: true, email: true, tel: true })
  .extend({ cpf: userSchema.shape.cpf.optional() });

  export type UserInput = z.infer<typeof userSchema>;
  export type UserLoginInput = z.infer<typeof userLoginSchema>;
  export type userUpdateInput = z.infer<typeof userUpdateSchema>;

export function userValidation(data: unknown) {
  return userSchema.safeParse(data);
}

export function userLoginValidation(data: unknown) {
  return userLoginSchema.safeParse(data);
}

export function userUpdateValidation(data: unknown) {
  return userUpdateSchema.safeParse(data);
}