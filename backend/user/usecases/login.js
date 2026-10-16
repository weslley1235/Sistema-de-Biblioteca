import bcrypt from 'bcrypt';
import { findByEmail } from '../repository.js';
import { userLoginValidation } from '../validator.js';

export async function login(email, password) {
  const result = userLoginValidation({ email, password });

  if (!result.success) {
    return { status: 400, message: result.error.issues[0].message };
  }

  const user = findByEmail(email);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return { status: 401, message: 'Email ou Password invalidos!' };
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
      tipoUsu: user.tipoUsu,
    },
  };
}
