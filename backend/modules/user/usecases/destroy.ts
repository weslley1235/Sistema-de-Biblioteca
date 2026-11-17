import { IUserRepository, USER_NOT_FOUND } from '../repositories/index';
import type { UseCaseResult } from './types';

export class DestroyUserUsecase {
  constructor(private readonly repository: IUserRepository){}

  public async execute(id: string): Promise<UseCaseResult> {
    try {
      const found = await this.repository.findById(id);

      if (found.isFail) {
        if (found.error?.message === USER_NOT_FOUND) {
          return {
            status: 404,
            message: 'Usuario nao encontrado',
          };
        }

        throw new Error(found.error?.message ?? 'Erro ao buscar usuário');
      }

      const loans = await this.repository.hasLoans(id);

      if (loans.isFail) {
        throw new Error(
          loans.error?.message ?? 'Erro ao verificar empréstimos',
        );
      }

      if (loans.success?.value) {
        return {
          status: 409,
          message:
            'Este usuário possui empréstimos registrados e não pode ser excluído',
        };
      }

      const destroyed = await this.repository.destroy(id);

      if (destroyed.isFail) {
        throw new Error(destroyed.error?.message ?? 'Erro ao excluir usuário');
      }

      return {
        status: 200,
        message: 'Usuario excluido com sucesso',
      };
    } catch (error) {
      return {
        status: 500,
        message:
          error instanceof Error ? error.message : 'Erro ao excluir usuário',
      };
    }
  }
}
