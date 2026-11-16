import bcrypt from 'bcrypt';

import { UserRepository } from '../repositories/index.js';
import { USER_NOT_FOUND } from '../repositories/index.js';
import { entityToPublicUser } from './publicUser.js';
import type { UserResult } from './types.js';

export async function login(
  email: string,
  password: string,
): Promise<UserResult> {
  const found = await new UserRepository().findCredentialsByEmail(email);

  if (found.isFail || !found.success) {
    if (found.error?.message === USER_NOT_FOUND) {
      return { status: 401, message: 'Email ou senha inválidos!' };
    }

    throw new Error(found.error?.message ?? 'Erro ao buscar usuário');
  }

  const { user, passwordHash } = found.success.value;

  if (!(await bcrypt.compare(password, passwordHash))) {
    return { status: 401, message: 'Email ou senha inválidos!' };
  }

  return {
    status: 200,
    message: 'Login realizado com sucesso',
    user: entityToPublicUser(user),
  };
}
