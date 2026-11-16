
import type { User } from '../entities/index.js';
import type { publicUser } from './types.js';

export class PublicUser {
  public static execute(user: User): publicUser {
    return {
      id: user.id,
      nome: user.nome,
      email: user.email,
      cpf: user.cpf,
      tel: user.tel,
      tipoUsu: user.tipoUsu,
    };
  }
}
