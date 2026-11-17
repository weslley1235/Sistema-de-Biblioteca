import type { User } from '../entities/index';
import type { publicUser } from './types';

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
