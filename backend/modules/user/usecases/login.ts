import bcrypt from 'bcrypt';

import { ADMIN } from '../../../shared/authentication.js';
import {databaseStrategy,type DatabaseProvider} from '../../../shared/index.js';
import { USER_NOT_FOUND } from '../repositories/index.js';
import { PublicUser } from './publicUser.js';
import type { UserResult } from './types.js';
import type { IUserRepository } from '../repositories/index.js';

const INVALID: UserResult = {
  status: 401,
  message: 'Email ou senha inválidos!',
};

export class LoginUserUsecase {
  constructor(private readonly userRepository: IUserRepository) {}

  public async execute(
    email: string,
    password: string,
    matricula?: string,
    cpf?: string,
  ): Promise<UserResult> {
    const found = await this.userRepository.findCredentialsByEmail(email);

    if (found.isFail || !found.success) {
      if (found.error?.message === USER_NOT_FOUND) {
        return INVALID;
      }

      throw new Error(found.error?.message ?? 'Erro ao buscar usuário');
    }

    const { user, passwordHash } = found.success.value;

    if (!(await bcrypt.compare(password, passwordHash))) {
      return INVALID;
    }

    if (user.tipoUsu === ADMIN) {
      if (!matricula || user.matricula !== matricula.trim()) {
        return INVALID;
      }
    } else if (!cpf || user.cpf !== cpf) {
      return INVALID;
    }

    return {
      status: 200,
      message: 'Login realizado com sucesso',
      user: PublicUser.execute(user),
    };
  }
}

export class LoginUserFactory {
  public static factory(provider: DatabaseProvider) {
    return new LoginUserUsecase(databaseStrategy[provider]().user);
  }
}
