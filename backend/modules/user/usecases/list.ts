import { UserRepository } from '../repositories';

export type ListedUser = {
  id: string;
  nome: string;
  email: string;
  tel: string;
  tipoUsu: string;
  cpf: string;
};

export class ListUsersUsecase {
  public async execute(): Promise<ListedUser[]> {
    const result = await new UserRepository().list();

    if (result.isFail || !result.success) {
      throw new Error(result.error?.message ?? 'Erro ao listar usuários');
    }

    return result.success.value.map(
      ({ id, nome, email, tel, cpf, tipoUsu }) => ({
        id,
        nome,
        email,
        tel,
        tipoUsu,
        cpf: `${cpf.slice(0, 3)}${'*'.repeat(Math.max(0, cpf.length - 5))}${cpf.slice(-2)}`,
      }),
    );
  }
}
