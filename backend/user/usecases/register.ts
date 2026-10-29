import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

import { findByEmail, findByCpf, save } from '../repository.js';
import type { NewUser } from '../repository.js';
import type { UserInput } from '../validator.js';
import type { UserResult } from './types.js';

function createUser(data: UserInput, hashedPassword: string): NewUser {
  return {
    id: uuidv4(),
    nome: data.nome,
    cpf: data.cpf,
    email: data.email,
    tel: data.tel,
    tipoUsu: data.tipoUsu,
    senha: hashedPassword,
  };
}

export async function register(data: UserInput): Promise<UserResult> {
  try {
    if (await findByEmail(data.email)) {
      return {
        status: 409,
        message: 'Esse email já está cadastrado',
      };
    }

    if (await findByCpf(data.cpf)) {
      return {
        status: 409,
        message: 'Esse CPF já está cadastrado',
      };
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = createUser(data, hashedPassword);

    await save(user);

    return {
      status: 201,
      message: 'Usuario cadastrado com sucesso',
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        cpf: user.cpf,
        tel: user.tel,
        tipoUsu: user.tipoUsu,
      },
    };
  } catch (error) {
    return {
      status: 500,
      message: error instanceof Error ? error.message : 'Erro ao cadastrar usuário',
    };
  }
}
