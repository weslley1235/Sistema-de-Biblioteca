import {databaseStrategy,type DatabaseProvider} from '../../../shared/index.js';
import type { IUserRepository } from '../repositories/index.js';

export type ListedUser = {
  id: string;
  nome: string;
  email: string;
  tel: string;
  tipoUsu: string;
  cpf: string;
  cep: string;
  state: string;
  city: string;
  street: string;
};

export class ListUsersUsecase {
  constructor(private readonly userRepository: IUserRepository) {}

  public async execute(): Promise<ListedUser[]> {
    const result = await this.userRepository.list();

    if (result.isFail || !result.success) {
      throw new Error(result.error?.message ?? 'Erro ao listar usuários');
    }

    return result.success.value.map(
      ({ id, nome, email, tel, cpf, tipoUsu, cep, state, city, street }) => ({
        id,
        nome,
        email,
        tel,
        tipoUsu,
        cep,
        state,
        city,
        street,
        cpf: `${cpf.slice(0, 3)}${'*'.repeat(Math.max(0, cpf.length - 5))}${cpf.slice(-2)}`,
      }),
    );
  }
}

export class ListUsersFactory {
  public static factory(provider: DatabaseProvider) {
    return new ListUsersUsecase(databaseStrategy[provider]().user);
  }
}
