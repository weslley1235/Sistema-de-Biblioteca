import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

import type { Response } from '../../../shared/index.js';
import { User as UserEntity } from '../entities/index.js';
import { UserRepository, USER_NOT_FOUND } from '../repositories/index.js';
import type { UserInput } from '../validator.js';
import { entityToPublicUser } from './publicUser.js';
import type { UserResult } from './types.js';

function alreadyExists(result: Response<UserEntity>): boolean {
  if (!result.isFail) return true;
  if (result.error?.message === USER_NOT_FOUND) return false;

  throw new Error(result.error?.message ?? 'Erro ao consultar usuário');
}

export async function register(data: UserInput): Promise<UserResult> {
  try {
    const repository = new UserRepository();

    if (alreadyExists(await repository.findByEmail(data.email))) {
      return { status: 409, message: 'Esse email já está cadastrado' };
    }

    if (alreadyExists(await repository.findByCpf(data.cpf))) {
      return { status: 409, message: 'Esse CPF já está cadastrado' };
    }

    const user = new UserEntity({
      id: uuidv4(),
      nome: data.nome,
      email: data.email,
      cpf: data.cpf,
      tel: data.tel,
      tipoUsu: data.tipoUsu,
    });

    const validation = user.validate();

    if (validation.isFail) {
      return {
        status: 400,
        message: validation.error?.message ?? 'Usuário inválido',
      };
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    const saved = await repository.save(user, passwordHash);

    if (saved.isFail) {
      return {
        status: 500,
        message: saved.error?.message ?? 'Erro ao cadastrar usuário',
      };
    }

    return {
      status: 201,
      message: 'Usuário cadastrado com sucesso',
      user: entityToPublicUser(user),
    };
  } catch (error) {
    return {
      status: 500,
      message:
        error instanceof Error ? error.message : 'Erro ao cadastrar usuário',
    };
  }
}
