import { z } from 'zod';

const userSchema = z.object({
  nome: z.string().min(1, 'Nome obrigatorio'),
  email: z.string().email('Email invalido'),
  cpf: z.string().regex(/^\d{11}$/, 'O CPF deve conter 11 dígitos'),
  tel: z.string().regex(/^\d{11}$/, 'O Telefone deve conter 11 dígitos'),
  tipoUsu: z.enum(['administracao', 'Professor', 'Aluno'], {
    error: 'Tipo de usuário inválido',
  }),
  password: z.string().min(8, 'A senha deve ter no mínimo 8 caracteres'),
  cep: z.string().regex(/^\d{8}$/, 'O CEP deve conter 8 dígitos'),
  state: z.string().regex(/^[A-Za-z]{2}$/, 'O estado deve conter 2 letras'),
  city: z.string().min(1, 'Cidade obrigatória'),
  street: z.string().min(1, 'Rua obrigatória'),
});

const userLoginSchema = z
  .object({
    email: z.string().email('Email ou senha invalidos!'),
    password: z.string().min(8, 'Email ou senha invalidos!'),
    matricula: z.string().trim().min(1).max(15).optional(),
    cpf: z
      .string()
      .regex(/^\d{11}$/, 'CPF inválido')
      .optional(),
  })
  .refine(
    (data) => {
      return Boolean(data.matricula) !== Boolean(data.cpf);
    },
    {
      message: 'Informe o CPF ou a matrícula',
    },
  );

const userUpdateSchema = userSchema
  .pick({
    nome: true,
    email: true,
    tel: true,
    cep: true,
    state: true,
    city: true,
    street: true,
  })
  .extend({ cpf: userSchema.shape.cpf.optional() });

export type UserInput = z.infer<typeof userSchema>;
export type UserLoginInput = z.infer<typeof userLoginSchema>;
export type UserUpdateInput = z.infer<typeof userUpdateSchema>;

export function userValidation(data: unknown) {
  return userSchema.safeParse(data);
}

export function userLoginValidation(data: unknown) {
  return userLoginSchema.safeParse(data);
}

export function userUpdateValidation(data: unknown) {
  return userUpdateSchema.safeParse(data);
}
