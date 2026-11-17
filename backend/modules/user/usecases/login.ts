import bcrypt from 'bcrypt';

import { ADMIN } from '../../../shared/authentication';
import { UserRepository, USER_NOT_FOUND } from '../repositories/index';
import { PublicUser } from './publicUser';
import type { UserResult } from './types';

const INVALID = { status: 401, message: 'Email ou senha inválidos!' };

export class LoginUserUsecase {
  public async execute(
    email: string,
    password: string,
    matricula?: string,
  ): Promise<UserResult> {
    const found = await new UserRepository().findCredentialsByEmail(email);

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

    if (user.tipoUsu === ADMIN && user.matricula !== matricula?.trim()) {
      return INVALID;
    }

    return {
      status: 200,
      message: 'Login realizado com sucesso',
      user: PublicUser.execute(user),
    };
  }
}
