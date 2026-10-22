import bcrypt from 'bcrypt';
import { findByEmail } from '../repository.js';

export async function login(email, password) {
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
    user: {
      id: user.id,
      nome: user.nome,
      email: user.email,
      cpf: user.cpf,
      tel: user.tel,
      tipoUsu: user.tipousu,
    },
  };
}