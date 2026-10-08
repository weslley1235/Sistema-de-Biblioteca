// IMPORTAÇÕES

import { cadastrarUsuario, buscarUsuCpf, buscarUsuEmail } from './usuario.js';

import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import { z } from 'zod';

// VALIDAÇÃO DO USUÁRIO

const usuarioSchema = z.object({
  nome: z
    .string()
    .min(3, 'O nome deve ter no minimo 3 caracteres')
    .regex(/^[A-Za-zÀ-ÿ\s]+$/, 'O nome deve conter apenas letras'),

  email: z.string().email('Email invalido'),

  senha: z
    .string()
    .min(8, 'Sua senha deve conter no minimo 8 caracteres')
    .regex(/^[0-9]+$/, 'A senha deve conter apenas números'),

  cpf_Matri: z.string().min(1, 'Seu CPF ou MAtricula tem que ser informado'),
  tel: z.string().min(1, 'Seu telefone é obrigatorio'),
  tipoUsu: z.enum(['Aluno', 'Professor']),
});

// VALIDAÇÃO DO LOGIN

const loginSchema = z.object({
  email: z.string().email('Email ou sena invalidos!'),
  senha: z.string().min(8, 'Email ou senha invalidos!'),
});

// CADASTRAR USUÁRIO

export async function registrar(nome, email, senha, cpf_Matri, tel, tipoUsu) {
  const resultado = usuarioSchema.safeParse({
    nome,
    email,
    senha,
    cpf_Matri,
    tel,
    tipoUsu,
  });

  if (!resultado.success) {
    return {
      status: 400,
      mensagem: resultado.error.issues[0].message,
    };
  }

  const usuarioExistente = buscarUsuCpf(cpf_Matri);

  if (usuarioExistente) {
    return {
      status: 409,
      mensagem: 'Esse CPF ou RA já possui um cadastro',
    };
  }

  const emailExistente = buscarUsuEmail(email);

  if (emailExistente) {
    return {
      status: 409,
      mensagem: 'Esse email já possui um cadastro',
    };
  }

  try {
    const senhaCrptografada = await bcrypt.hash(senha, 10);

    const usuario = {
      id: uuidv4(),
      nome,
      email,
      senha: senhaCrptografada,
      cpf_Matri,
      tel,
      tipoUsu,
    };

    cadastrarUsuario(usuario);

    return {
      status: 201,
      mensagem: 'Usuario cadastrado com sucesso',
    };
  } catch (error) {
    return {
      status: 500,
      message: error.message,
    };
  }
}

// LOGIN

export async function login(email, senha) {
  const resultado = loginSchema.safeParse({
    email,
    senha,
  });

  if (!resultado.success) {
    return {
      status: 400,
      mensagem: resultado.error.issues[0].message,
    };
  }

  const usuario = buscarUsuEmail(email);

  if (!usuario) {
    return {
      status: 401,
      mensagem: 'Email ou senha invalidos!',
    };
  }

  const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

  if (!senhaCorreta) {
    return {
      status: 401,
      mensagem: 'Email ou senha invalidos!',
    };
  }

  return {
    status: 200,
    mensagem: 'login realizado com sucesso',
    usuario: {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      cpf_Matri: usuario.cpf_Matri,
      tel: usuario.tel,
      tipoUsu: usuario.tipoUsu,
    },
  };
}
