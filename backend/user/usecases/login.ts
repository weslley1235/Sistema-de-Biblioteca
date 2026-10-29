import bcrypt from 'bcrypt';

import { findByEmail } from '../repository.js';
import { topublicUser } from './publicUser.js';
import type { UserResult } from './types.js';

export async function login(email: string, password: string): Promise<UserResult> {
  const user = await findByEmail(email);

  if (!user || !(await bcrypt.compare(password, user.senha))) {
    return {
      status: 401,
      message: 'Email ou senha inválidos!',
    };
  }

  return {
    status: 200,
    message: 'Login realizado com sucesso',
    user: topublicUser(user),
  };
}